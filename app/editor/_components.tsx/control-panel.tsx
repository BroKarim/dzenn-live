"use client"

import { useState } from "react"
import { Palette,  BarChart3, Settings, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BackgroundOptions from "./background-options"
import { ProfileTabContent } from "./profile-tab-content"
import { CardTextureSelector } from "./texture-selector"
import BackgroundEffect from "./background-effect"
import { EditorState } from "@/lib/editor"


interface ControlPanelProps {
  state: EditorState
  onUpdate: (updates: Partial<EditorState>) => void
}

type TabType = "profile" | "theme" | "analytic" | "setting"

export default function ControlPanel({ state, onUpdate }: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  const tabs = [
    { id: "profile" as TabType, icon: User, label: "Profile" },
    { id: "theme" as TabType, icon: Palette, label: "Theme" },
    { id: "analytic" as TabType, icon: BarChart3, label: "Analytics" },
    { id: "setting" as TabType, icon: Settings, label: "Settings" },
  ]

  return (
    <div className="hidden w-[560px] flex-col gap-4 overflow-y-auto lg:flex">
      {/* Tab Navigation */}
      <div className="flex gap-2 bg-card rounded-lg p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={tab.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium hidden xl:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <ProfileTabContent state={state} onUpdate={onUpdate} />
      )}

      {activeTab === "theme" && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              Background
            </CardTitle>
            <CardDescription>Customize the editor background</CardDescription>
          </CardHeader>
          <CardContent>
            <BackgroundOptions state={state} onUpdate={onUpdate} />
            <BackgroundEffect 
              state={state.bgEffects} 
              onUpdate={(updates) => onUpdate({ bgEffects: { ...state.bgEffects, ...updates } })} 
            />
            <CardTextureSelector state={state} onUpdate={onUpdate} />
          </CardContent>
        </Card>
      )}

      {activeTab === "analytic" && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </CardTitle>
            <CardDescription>View your statistics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Analytics feature coming soon...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "setting" && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Settings
            </CardTitle>
            <CardDescription>Configure your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Settings feature coming soon...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}