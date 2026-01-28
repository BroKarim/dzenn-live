// components/control-panel/tabs/profile/profile-layout-selector.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { AlignCenter, AlignRight, LayoutDashboard, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ProfileLayout } from "@/lib/generated/prisma/enums";
import { updateLayout } from "@/server/user/profile/actions";
import { toast } from "sonner";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ProfileLayoutSelectorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ProfileLayoutSelector({ profile, onUpdate }: ProfileLayoutSelectorProps) {
  const [localLayout, setLocalLayout] = useState(profile.layout);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const layouts = [
    { id: ProfileLayout.center, icon: AlignCenter, label: "Centered" },
    { id: ProfileLayout.left_stack, icon: AlignRight, label: "Left Stack" },
    { id: ProfileLayout.left_row, icon: LayoutDashboard, label: "Left Row" },
  ];

  useEffect(() => {
    if (localLayout === profile.layout) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const result = await updateLayout(localLayout);
        if (result.success && result.data) {
          onUpdate(result.data);
          toast.success("Layout saved!");
        } else {
          setLocalLayout(profile.layout);
          toast.error(result.error || "Failed to save layout");
        }
      } catch (error) {
        setLocalLayout(profile.layout);
        toast.error("Error saving layout");
      } finally {
        setIsSaving(false);
      }
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [localLayout, profile.layout]);

  const handleLayoutChange = (layout: ProfileLayout) => {
    setLocalLayout(layout);
    onUpdate({ ...profile, layout });
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        {isSaving && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {layouts.map((layout) => {
          const Icon = layout.icon;
          return (
            <button
              key={layout.id}
              onClick={() => handleLayoutChange(layout.id)}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                localLayout === layout.id
                  ? "shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none bg-primary/5 text-primary"
                  : "border-muted bg-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{layout.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
