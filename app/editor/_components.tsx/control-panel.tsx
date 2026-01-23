"use client"

import { useState } from "react"
import { EditorState } from "@/lib/editor"
import { 
  TabNavigation, 
  TabType, 
  ProfileTab, 
  ThemeTab, 
  AnalyticsTab, 
  SettingsTab 
} from "@/components/control-panel"

interface ControlPanelProps {
  state: EditorState
  onUpdate: (updates: Partial<EditorState>) => void
}

export default function ControlPanel({ state, onUpdate }: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  return (
    <div className="hidden w-[560px] flex-col gap-4 overflow-y-auto lg:flex no-scrollbar">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1">
        {activeTab === "profile" && <ProfileTab state={state} onUpdate={onUpdate} />}
        {activeTab === "theme" && <ThemeTab state={state} onUpdate={onUpdate} />}
        {activeTab === "analytic" && <AnalyticsTab />}
        {activeTab === "setting" && <SettingsTab />}
      </div>
    </div>
  )
}