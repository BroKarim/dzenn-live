"use client";

import { PreviewBackground, PreviewProfile, PreviewSocials, PreviewLinks } from "@/components/preview";
import type { ProfileEditorData } from "@/server/user/profile/payloads";
import { getThemeById } from "@/lib/themes";
import { useEffect } from "react";

interface PreviewProps {
  profile: ProfileEditorData;
  viewMode: "mobile" | "desktop";
}

export default function Preview({ profile, viewMode }: PreviewProps) {
  const theme = getThemeById(profile.theme);

  useEffect(() => {
    if (!theme.fontUrl) return;

    const fontId = `theme-font-${theme.id}`;
    if (document.getElementById(fontId)) return;

    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = theme.fontUrl;
    document.head.appendChild(link);

    return () => {
      const existingLink = document.getElementById(fontId);
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [theme.id, theme.fontUrl]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#181819] shadow-dzenn border-none rounded-2xl p-4 sm:p-8">
        <div
          className={`relative transition-all duration-500  ease-in-out overflow-hidden shadow-2xl ${
            viewMode === "mobile" ? "aspect-9/19 w-full max-w-[360px] rounded-[2.5rem] border-4 border-zinc-950" : "h-full w-full rounded-xl border-border border"
          }`}
          style={
            {
              ...theme.variables,
              fontFamily: theme.variables["--font-sans"],
              backgroundColor: "transparent",
            } as React.CSSProperties
          }
        >
          <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
            <PreviewBackground profile={profile} />
          </div>

          <div className="relative h-full overflow-y-auto  no-scrollbar" style={{ padding: `${profile.padding}px` }}>
            <div className="mx-auto space-y-4 flex w-full  rounded-2xl max-w-[420px] flex-col items-center pb-24 pt-12">
              <PreviewProfile profile={profile} />
              <PreviewLinks profile={profile} />
            </div>
          </div>
          <PreviewSocials profile={profile} />
        </div>
      </div>
    </div>
  );
}