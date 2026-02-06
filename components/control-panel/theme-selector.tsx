"use client";

import { Label } from "@/components/ui/label";
import { THEMES } from "@/lib/themes";
import type { ProfileEditorData } from "@/server/user/profile/payloads";
import { Check } from "lucide-react";
import { updateTheme } from "@/server/user/profile/actions";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ThemeSelectorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ThemeSelector({ profile, onUpdate }: ThemeSelectorProps) {
  const themes = Object.values(THEMES);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Debounce save to database
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const result = await updateTheme(profile.theme);
      if (!result.success) {
        toast.error(result.error || "Failed to save theme");
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [profile.theme]);

  return (
    <div className="space-y-3">
      <Label className="text-xs tracking-wider text-muted-foreground">Theme Preset</Label>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => {
          const isActive = profile.theme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => onUpdate({ ...profile, theme: theme.id })}
              className={`
                relative group rounded-xl p-3 border transition-all duration-200
                ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50 hover:bg-accent/50"}
              `}
            >
              {/* Theme Preview */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="h-8 w-8 rounded-lg border"
                  style={{
                    background: theme.variables["--card"],
                    borderColor: theme.variables["--card-border"] || theme.variables["--border"],
                  }}
                />
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold">{theme.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{theme.type}</p>
                </div>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
