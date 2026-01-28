"use client";

import { useState } from "react";
import { TabNavigation, TabType, ProfileTab, ThemeTab, AnalyticsTab, SettingsTab } from "@/components/control-panel";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ControlPanelProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export default function ControlPanel({ profile, onUpdate }: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <div className="hidden w-[500px] flex-col gap-4 overflow-y-auto bg-[#181819] shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none rounded-2xl lg:flex no-scrollbar">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1">
        {activeTab === "profile" && <ProfileTab profile={profile} onUpdate={onUpdate} />}
        {activeTab === "theme" && <ThemeTab profile={profile} onUpdate={onUpdate} />}
        {activeTab === "analytic" && <AnalyticsTab profileId={profile.id} links={profile.links} />}
        {activeTab === "setting" && <SettingsTab />}
      </div>
    </div>
  );
}
