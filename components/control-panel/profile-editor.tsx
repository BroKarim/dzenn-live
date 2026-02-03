"use client";

import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ProfileEditorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer shrink-0">
          <div className="h-14 w-14 rounded-xl overflow-hidden shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none flex items-center justify-center transition-all group-hover:border-primary/50">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : <Camera className="h-5 w-5 text-muted-foreground" />}
          </div>
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
          <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Camera className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <Input
            value={profile.displayName || ""}
            onChange={(e) => onUpdate({ ...profile, displayName: e.target.value })}
            placeholder="Display Name"
            className="h-9 text-sm font-medium bg-transparent border-0 rounded-md px-1 focus-visible:ring-0 focus-visible:shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none"
          />
        </div>
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
