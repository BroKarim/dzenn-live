"use client";

import { useState } from "react";
import { Camera, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateProfile } from "@/server/user/profile/actions";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ProfileEditorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { id, userId, slug, ...payload } = profile;

      const finalPayload = {
        ...payload,
        displayName: payload.displayName ?? "",
      };

      const result = await updateProfile(finalPayload as any);

      if (result.success) {
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative group cursor-pointer">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : <Camera className="h-8 w-8 text-muted-foreground" />}
          </div>
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[10px] text-white font-medium text-center px-2 uppercase">Change</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Display Name</Label>
          <Input value={profile.displayName || ""} onChange={(e) => onUpdate({ ...profile, displayName: e.target.value })} placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label>Bio / Description</Label>
          <Textarea value={profile.bio || ""} onChange={(e) => onUpdate({ ...profile, bio: e.target.value })} placeholder="Tell something about yourself" rows={3} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Save Profile Changes
      </Button>
    </div>
  );
}
