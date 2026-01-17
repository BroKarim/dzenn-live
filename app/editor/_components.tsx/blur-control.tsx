"use client"

import { Slider } from "@/components/ui/slider"

interface BlurControlProps {
  state: { blurAmount: number }
  onUpdate: (updates: Partial<{ blurAmount: number }>) => void
}

export default function BlurControl({ state, onUpdate }: BlurControlProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Background Blur</label>
        <span className="text-xs text-muted-foreground">{state.blurAmount}px</span>
      </div>
      <Slider
        value={[state.blurAmount]}
        onValueChange={(value) => onUpdate({ blurAmount: value[0] })}
        min={0}
        max={30}
        step={1}
        className="w-full"
      />
    </div>
  )
}
