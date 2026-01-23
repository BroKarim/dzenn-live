import { AlignCenter, AlignRight, LayoutDashboard } from "lucide-react"
import { Label } from "@/components/ui/label"
import { EditorState } from "@/lib/editor"

interface ProfileLayoutSelectorProps {
  state: EditorState
  onUpdate: (updates: Partial<EditorState>) => void
}

export function ProfileLayoutSelector({ state, onUpdate }: ProfileLayoutSelectorProps) {
  const layouts = [
    { id: "center", icon: AlignCenter, label: "Centered" },
    { id: "left-stack", icon: AlignRight, label: "Left Stack" },
    { id: "left-row", icon: LayoutDashboard, label: "Left Row" },
  ]

  return (
    <div className="space-y-3">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Profile Layout</Label>
      <div className="grid grid-cols-3 gap-2">
        {layouts.map((layout) => {
          const Icon = layout.icon
          return (
            <button
              key={layout.id}
              onClick={() => onUpdate({ profileLayout: layout.id as any })}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                state.profileLayout === layout.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted bg-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{layout.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}