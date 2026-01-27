import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ProfileEditor } from "@/components/control-panel/profile-editor";
import { SocialMediaEditor } from "@/components/control-panel/social-editor";
import { ProfileLayoutSelector } from "@/components/control-panel/profile-layout-selector";
import { LinkCardEditor } from "@/components/control-panel/link-card-editor";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ProfileTabProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ProfileTab({ profile, onUpdate }: ProfileTabProps) {
  return (
    <>
      <ProfileEditor profile={profile} onUpdate={onUpdate} />
      <ProfileLayoutSelector profile={profile} onUpdate={onUpdate} />
      <LinkCardEditor profile={profile} onUpdate={onUpdate} />
      <Accordion className="w-full space-y-4  border-none">
        <AccordionItem value="social-links" className="border rounded-xl bg-card px-4">
          <AccordionTrigger className="hover:no-underline font-semibold">Social Links</AccordionTrigger>
          <AccordionContent className="pb-6">
            <SocialMediaEditor profile={profile} onUpdate={onUpdate} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
