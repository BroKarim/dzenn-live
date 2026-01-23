import { Palette, BarChart3, Settings, User, LucideIcon } from "lucide-react"

export type TabType = "profile" | "theme" | "analytic" | "setting"

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: TabType; icon: LucideIcon; label: string }[] = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "theme", icon: Palette, label: "Theme" },
    { id: "analytic", icon: BarChart3, label: "Analytics" },
    { id: "setting", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="flex gap-2 bg-card rounded-lg p-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
  )
}
