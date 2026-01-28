"use client";

import { useState } from "react";
import { ChevronDown, User, LayoutGrid, Link2 } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ProfileEditor } from "@/components/control-panel/profile-editor";
import { SocialMediaEditor } from "@/components/control-panel/social-editor";
import { ProfileLayoutSelector } from "@/components/control-panel/profile-layout-selector";
import { LinkCardEditor } from "@/components/control-panel/link-card-editor";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ProfileTabProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  isOpen: boolean;
}

function SectionHeader({ icon: Icon, title, description, isOpen }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 w-full py-3 px-4 hover:bg-muted/50 transition-colors rounded-xl">
      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
      </div>
      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
    </div>
  );
}

export function ProfileTab({ profile, onUpdate }: ProfileTabProps) {
  const [openSections, setOpenSections] = useState({
    profile: true,
    layout: false,
    links: true,
    social: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-2 px-3 pb-4">
      {/* Profile Section */}
      <div className="px-2 pb-2">
        <ProfileEditor profile={profile} onUpdate={onUpdate} />
      </div>

      {/* Layout Section */}
      <div className="px-2 pb-2">
        <ProfileLayoutSelector profile={profile} onUpdate={onUpdate} />
      </div>
      {/* Links Section */}
      <div className="px-2 pb-2">
        <LinkCardEditor profile={profile} onUpdate={onUpdate} />
      </div>

      {/* Social Links Section - tetap menggunakan accordion existing */}
      <Collapsible open={openSections.social}>
        <CollapsibleTrigger onClick={() => toggleSection("social")} className="w-full">
          <SectionHeader icon={User} title="Social Links" description="Connect your social accounts" isOpen={openSections.social} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-2 pb-2">
            <SocialMediaEditor profile={profile} onUpdate={onUpdate} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
