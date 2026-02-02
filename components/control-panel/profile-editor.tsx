"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Loader2, Check, Cloud, CloudOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateProfile } from "@/server/user/profile/actions";
import type { ProfileEditorData } from "@/server/user/profile/payloads";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface ProfileEditorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>(JSON.stringify(profile));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          ...profile,
          avatarUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const debouncedSave = useCallback(async () => {
    const currentData = JSON.stringify(profile);
    if (currentData === lastSavedRef.current) return;

    setSaveStatus("saving");
    try {
      const { id, userId, slug, ...payload } = profile;
      const finalPayload = {
        ...payload,
        displayName: payload.displayName ?? "",
      };

      const result = await updateProfile(finalPayload as any);

      if (result.success) {
        setSaveStatus("saved");
        lastSavedRef.current = currentData;
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
      toast.error("Error saving profile");
    }
  }, [profile]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [profile.displayName, profile.bio, profile.avatarUrl, debouncedSave]);

  return (
    <div className="space-y-4">
      <div className="flex items-center  gap-3">
        <div className="relative group  cursor-pointer shrink-0">
          <div className="h-14 w-14 rounded-xl overflow-hidden shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none  flex items-center justify-center transition-all group-hover:border-primary/50">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : <Camera className="h-5 w-5 text-muted-foreground" />}
          </div>
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
          <div className="absolute inset-0 flex items-center justify-center  rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Camera className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="flex-1 ">
          <Input
            value={profile.displayName || ""}
            onChange={(e) => onUpdate({ ...profile, displayName: e.target.value })}
            placeholder="Display Name"
            className="h-9 text-sm font-medium bg-transparent border-0 rounded-md px-1 focus-visible:ring-0 focus-visible:shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="shrink-0 pt-2">
                {saveStatus === "saving" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {saveStatus === "saved" && <Check className="h-4 w-4 text-emerald-500" />}
                {saveStatus === "error" && <CloudOff className="h-4 w-4 text-destructive" />}
                {saveStatus === "idle" && <Cloud className="h-4 w-4 text-muted-foreground/50" />}
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "saved" && "All changes saved"}
              {saveStatus === "error" && "Failed to save"}
              {saveStatus === "idle" && "Auto-save enabled"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-1.5">
        <Textarea
          value={profile.bio || ""}
          onChange={(e) => onUpdate({ ...profile, bio: e.target.value })}
          placeholder="Write a short bio..."
          rows={2}
          className="text-sm resize-none focus-visible:ring-1 focus-visible:ring-primary/50 shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none"
        />
        <div className="flex justify-end items-center">
          <span className="text-[10px] text-muted-foreground tabular-nums">{(profile.bio || "").length}/160</span>
        </div>
      </div>
    </div>
  );
}
