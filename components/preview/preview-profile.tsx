import React from "react"
import { EditorState } from "@/lib/editor"

interface PreviewProfileProps {
  state: EditorState
}

export function PreviewProfile({ state }: PreviewProfileProps) {
  const { profile, profileLayout } = state

  return (
    <div 
      className={`mb-8 flex w-full gap-4 transition-all duration-300 ${
        profileLayout === "center" 
          ? "flex-col items-center text-center" 
          : profileLayout === "left-stack"
          ? "flex-col items-start text-left"
          : "items-center justify-between text-left"
      }`}
    >
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-white/20 bg-zinc-200 shadow-xl">
        {profile.avatar ? (
          <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-2xl font-bold text-white">
            {profile.name.charAt(0).toUpperCase() || "B"}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-white drop-shadow-md">
          {profile.name || "Your Name"}
        </h2>
        <p className="text-sm font-medium text-white/80 drop-shadow-sm line-clamp-2">
          {profile.description || "Add your bio here"}
        </p>
      </div>
    </div>
  )
}
