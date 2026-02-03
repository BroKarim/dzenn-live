import React from "react";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface PreviewProfileProps {
  profile: ProfileEditorData;
}

export function PreviewProfile({ profile }: PreviewProfileProps) {
  return (
    <div
      className={`mb-8 flex w-full gap-4 transition-all duration-300 ${
        profile.layout === "center" ? "flex-col items-center text-center" : profile.layout === "left_stack" ? "flex-col items-start text-left" : "items-center justify-between text-left"
      }`}
    >
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full ">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover " />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-2xl font-bold text-white">{profile.displayName?.charAt(0).toUpperCase() || "B"}</div>
        )}
      </div>

      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-white drop-shadow-md">{profile.displayName || "Your Name"}</h2>
        <p className="text-sm font-medium text-white/80 drop-shadow-sm line-clamp-2">{profile.bio || "Add your bio here"}</p>
      </div>
    </div>
  );
}
