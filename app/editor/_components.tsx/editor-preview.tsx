"use client"

import  { useState } from "react"
import { EditorState } from "@/lib/editor"
import { 
  PreviewBackground, 
  PreviewProfile, 
  PreviewSocials, 
  PreviewLinks, 
  ViewModeToggle 
} from "@/components/preview"

interface PreviewProps {
  state: EditorState
}

export default function Preview({ state }: PreviewProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile")

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-zinc-50/50 p-4 dark:bg-zinc-900/50">
        <div
          className={`relative transition-all duration-500 ease-in-out overflow-hidden shadow-2xl ${
            viewMode === "mobile"
              ? "aspect-9/19 w-full max-w-[360px] rounded-[2.5rem] border-4 border-zinc-950"
              : "h-full w-full rounded-xl border-border border"
          }`}
        >
          <PreviewBackground state={state} />

          <div
            className="relative h-full overflow-y-auto no-scrollbar"
            style={{ padding: `${state.padding}px` }}
          >
            <div className="mx-auto flex w-full max-w-[420px] flex-col items-center pb-10 pt-12">
              <PreviewProfile state={state} />
              <PreviewSocials state={state} />
              <PreviewLinks state={state} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

