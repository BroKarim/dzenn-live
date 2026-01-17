"use client"

import { useState } from "react"
import EditorHeader from "./editor-header"
import EditorPreview from "./editor-preview"
import ControlPanel from "./control-panel"

interface EditorState {
  backgroundType: "wallpaper" | "color" | "gradient"
  backgroundColor: string
  backgroundGradient: { from: string; to: string }
  blurAmount: number
  padding: number
}

export default function DashboardEditor() {
  const [state, setState] = useState<EditorState>({
    backgroundType: "gradient",
    backgroundColor: "#1a1a1a",
    backgroundGradient: { from: "#4f46e5", to: "#ec4899" },
    blurAmount: 8,
    padding: 16,
  })

  const updateState = (updates: Partial<EditorState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <EditorHeader />
      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        <EditorPreview state={state} />
        <ControlPanel state={state} onUpdate={updateState} />
      </div>
    </div>
  )
}
