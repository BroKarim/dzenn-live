"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

const GRADIENT_PRESETS = [
  { name: "Blue to Pink", from: "#4f46e5", to: "#ec4899" },
  { name: "Orange to Red", from: "#f97316", to: "#dc2626" },
  { name: "Green to Blue", from: "#10b981", to: "#3b82f6" },
  { name: "Purple to Violet", from: "#a855f7", to: "#6d28d9" },
  { name: "Teal to Cyan", from: "#14b8a6", to: "#06b6d4" },
]

const COLORS = ["#1a1a1a", "#2d2d2d", "#3f3f3f", "#4f4f4f", "#1e293b", "#334155"]

interface BackgroundOptionsProps {
  state: {
    backgroundType: "wallpaper" | "color" | "gradient"
    backgroundColor: string
    backgroundGradient: { from: string; to: string }
  }
  onUpdate: (
    updates: Partial<{
      backgroundType: "wallpaper" | "color" | "gradient"
      backgroundColor: string
      backgroundGradient: { from: string; to: string }
    }>,
  ) => void
}

export default function BackgroundOptions({ state, onUpdate }: BackgroundOptionsProps) {
  return (
    <Tabs value={state.backgroundType} onValueChange={(value) => onUpdate({ backgroundType: value as any })}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="color">Color</TabsTrigger>
        <TabsTrigger value="gradient">Gradient</TabsTrigger>
      </TabsList>

      <TabsContent value="color" className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ backgroundColor: color })}
              className={`h-10 rounded-lg border-2 transition-all ${
                state.backgroundColor === color ? "border-primary shadow-lg" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-muted-foreground">Custom:</span>
          <Input
            type="color"
            value={state.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="h-8 w-12 cursor-pointer"
          />
        </div>
      </TabsContent>

      <TabsContent value="gradient" className="space-y-4">
        <div className="space-y-3">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onUpdate({ backgroundGradient: { from: preset.from, to: preset.to } })}
              className="w-full rounded-lg border-2 border-transparent p-3 text-left transition-all hover:border-primary"
              style={{
                background: `linear-gradient(135deg, ${preset.from} 0%, ${preset.to} 100%)`,
              }}
            >
              <span className="text-xs font-medium text-white drop-shadow-sm">{preset.name}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3 border-t border-border pt-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">From Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={state.backgroundGradient.from}
                onChange={(e) =>
                  onUpdate({
                    backgroundGradient: { ...state.backgroundGradient, from: e.target.value },
                  })
                }
                className="h-8 w-12 cursor-pointer"
              />
              <Input
                type="text"
                value={state.backgroundGradient.from}
                onChange={(e) =>
                  onUpdate({
                    backgroundGradient: { ...state.backgroundGradient, from: e.target.value },
                  })
                }
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">To Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={state.backgroundGradient.to}
                onChange={(e) =>
                  onUpdate({
                    backgroundGradient: { ...state.backgroundGradient, to: e.target.value },
                  })
                }
                className="h-8 w-12 cursor-pointer"
              />
              <Input
                type="text"
                value={state.backgroundGradient.to}
                onChange={(e) =>
                  onUpdate({
                    backgroundGradient: { ...state.backgroundGradient, to: e.target.value },
                  })
                }
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
