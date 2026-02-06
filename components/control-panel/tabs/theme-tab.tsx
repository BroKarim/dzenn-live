import BackgroundOptions from "@/components/control-panel/background-options";
import BackgroundPattern from "@/components/control-panel/background-pattern";
import BackgroundEffect from "@/components/control-panel/background-effect";
import { CardTextureSelector } from "@/components/control-panel/texture-selector";
import { ThemeSelector } from "@/components/control-panel/theme-selector";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ThemeTabProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ThemeTab({ profile, onUpdate }: ThemeTabProps) {
  return (
    <div className=" px-3 pb-4">
      <div className="space-y-6">
        <ThemeSelector profile={profile} onUpdate={onUpdate} />
        <BackgroundOptions profile={profile} onUpdate={onUpdate} />
        <BackgroundPattern profile={profile} onUpdate={onUpdate} />
        <BackgroundEffect profile={profile} onUpdate={onUpdate} />
        <CardTextureSelector profile={profile} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
