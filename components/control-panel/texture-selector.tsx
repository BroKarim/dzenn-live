import { Box, Layers } from "lucide-react"
import { Label } from "@/components/ui/label"

export function CardTextureSelector({ state, onUpdate }: any) {
  const textures = [
    { id: "base", label: "Default", icon: Box },
    { id: "glassy", label: "Glassmorphism", icon: Layers },
  ]

  return (
    <div className="space-y-3">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Card Texture</Label>
      <div className="grid grid-cols-2 gap-2">
        {textures.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => onUpdate({ cardTexture: t.id })}
              className={`flex flex-col items-center justify-center gap-2  border-2 p-4 transition-all ${
                state.cardTexture === t.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted bg-transparent text-muted-foreground hover:border-border"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}