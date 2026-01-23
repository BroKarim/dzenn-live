"use client"

import EditorHeader from "./editor-header"
import Preview from "./editor-preview"
import ControlPanel from "./control-panel"
import { useEditorState } from "@/hooks/use-editor-state"

export default function DashboardEditor() {
  const { state, updateState } = useEditorState()

  return (
    <div className="flex h-screen flex-col bg-background">
      <EditorHeader />
      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        <Preview state={state} />
        <ControlPanel state={state} onUpdate={updateState} />
      </div>
    </div>
  )
}
