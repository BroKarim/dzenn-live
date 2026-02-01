import React from "react"
import { Icons } from "@/components/icons"

interface ViewModeToggleProps {
  viewMode: "mobile" | "desktop"
  setViewMode: (mode: "mobile" | "desktop") => void
}

export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
        <button
          onClick={() => setViewMode("mobile")}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            viewMode === "mobile"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icons.phone className="h-4 w-4" />
          Mobile
        </button>
        <button
          onClick={() => setViewMode("desktop")}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            viewMode === "desktop"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icons.monitor className="h-4 w-4" />
          Desktop
        </button>
      </div>
    </div>
  )
}
