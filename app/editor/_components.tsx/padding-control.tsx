"use client"

import { Slider } from "@/components/ui/slider"
import React from "react"

interface PaddingControlProps {
  state: { padding: number }
  onUpdate: (updates: Partial<{ padding: number }>) => void
}

export default function PaddingControl({ state, onUpdate }: PaddingControlProps) {
  const [padding, setPadding] = React.useState(state.padding)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Padding</label>
        <span className="text-xs text-muted-foreground">{padding}px</span>
      </div>
      <Slider
        value={[padding]}
        onValueChange={(value) => {
          setPadding(value[0])
          onUpdate({ padding: value[0] })
        }}
        min={0}
        max={64}
        step={1}
        className="w-full"
      />
    </div>
  )
}
