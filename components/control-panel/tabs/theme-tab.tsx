import { Palette, Loader2, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundOptions from "@/components/control-panel/background-options";
import BackgroundEffect from "@/components/control-panel/background-effect";
import { CardTextureSelector } from "@/components/control-panel/texture-selector";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { updateProfile } from "@/server/user/profile/actions";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ThemeTabProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ThemeTab({ profile, onUpdate }: ThemeTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Omit non-updatable fields
      const { id, userId, slug, socials, links, ...payload } = profile;

      const result = await updateProfile(payload as any);

      if (result.success) {
        toast.success("Theme updated!");
      } else {
        toast.error("Failed to save theme");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving theme");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2 px-3 pb-4">
      <div className="space-y-6">
        <BackgroundOptions profile={profile} onUpdate={onUpdate} />
        <BackgroundEffect profile={profile} onUpdate={onUpdate} />
        <CardTextureSelector profile={profile} onUpdate={onUpdate} />

        <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Save Theme Changes
        </Button>
      </div>
    </div>
  );
}
