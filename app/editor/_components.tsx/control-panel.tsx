"use client";

import { useState, useEffect } from "react";
import { EditorState } from "@/lib/editor";
import { TabNavigation, TabType, ProfileTab, ThemeTab, AnalyticsTab, SettingsTab } from "@/components/control-panel";

interface ControlPanelProps {
  state: EditorState;
  onUpdate: (updates: Partial<EditorState>) => void;
  profileId?: string;
  links?: Array<{ id: string; title: string; url: string; isActive?: boolean }>;
}

export default function ControlPanel({ state, onUpdate, profileId, links = [] }: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <div className="hidden w-[560px] flex-col gap-4 overflow-y-auto lg:flex no-scrollbar">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1">
        {activeTab === "profile" && <ProfileTab state={state} onUpdate={onUpdate} />}
        {activeTab === "theme" && <ThemeTab state={state} onUpdate={onUpdate} />}
        {activeTab === "analytic" && <AnalyticsTab profileId={profileId} links={links} />}
        {activeTab === "setting" && <SettingsTab />}
      </div>
    </div>
  );
}
