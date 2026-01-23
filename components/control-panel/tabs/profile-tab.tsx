import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ProfileEditor } from "@/components/control-panel/profile-editor"
import { SocialMediaEditor } from "@/components/control-panel/social-editor"
import { ProfileLayoutSelector } from "@/components/control-panel/profile-layout-selector"
import { LinkCardEditor } from "@/components/control-panel/link-card-editor"
import { EditorState } from "@/lib/editor"

interface ProfileTabProps {
  state: EditorState
  onUpdate: (updates: Partial<EditorState>) => void
}

export function ProfileTab({ state, onUpdate }: ProfileTabProps) {
  return (
    <Accordion  className="w-full space-y-4 border-none">
      <AccordionItem value="profile-info" className="border rounded-xl bg-card px-4">
        <AccordionTrigger className="hover:no-underline font-semibold">
          Profile Information
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <ProfileEditor state={state} onUpdate={onUpdate} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="profile-layout" className="border rounded-xl bg-card px-4">
        <AccordionTrigger className="hover:no-underline font-semibold">
          Layout & Alignment
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <ProfileLayoutSelector state={state} onUpdate={onUpdate} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="social-links" className="border rounded-xl bg-card px-4">
        <AccordionTrigger className="hover:no-underline font-semibold">
          Social Links
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <SocialMediaEditor state={state} onUpdate={onUpdate} />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="add-links" className="border rounded-xl bg-card px-4">
        <AccordionTrigger className="hover:no-underline font-semibold">
          Add Link
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <LinkCardEditor state={state} onUpdate={onUpdate} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
