import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Sparkles, Sun, Droplets, Contrast, EyeOff } from "lucide-react"
import { EditorState } from "@/lib/editor"



interface BackgroundEffectsProps {
  state: EditorState["bgEffects"]
  onUpdate: (updates: Partial<EditorState["bgEffects"]>) => void
}

export default function BackgroundEffects({ state, onUpdate }: BackgroundEffectsProps) {
  const settings = [
    { id: "blur", label: "Blur", icon: EyeOff, min: 0, max: 20, step: 1, unit: "px" },
    { id: "noise", label: "Grain / Noise", icon: Sparkles, min: 0, max: 100, step: 1, unit: "%" },
    { id: "brightness", label: "Brightness", icon: Sun, min: 50, max: 150, step: 1, unit: "%" },
    { id: "saturation", label: "Saturation", icon: Droplets, min: 0, max: 200, step: 1, unit: "%" },
    { id: "contrast", label: "Contrast", icon: Contrast, min: 50, max: 150, step: 1, unit: "%" },
  ]

  return (
    <div className="space-y-6 pt-2">
      {settings.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <Label>{item.label}</Label>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {state[item.id as keyof typeof state]}{item.unit}
              </span>
            </div>
            <Slider
              value={[state[item.id as keyof typeof state]]}
              min={item.min}
              max={item.max}
              step={item.step}
              onValueChange={(val) => onUpdate({ [item.id]: val[0] })}
              className="py-2"
            />
          </div>
        )
      })}
    </div>
  )
}