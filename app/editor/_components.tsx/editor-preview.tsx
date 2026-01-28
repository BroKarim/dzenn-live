"use client";

import { PreviewBackground, PreviewProfile, PreviewSocials, PreviewLinks } from "@/components/preview";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface PreviewProps {
  profile: ProfileEditorData;
  viewMode: "mobile" | "desktop";
}

export default function Preview({ profile, viewMode }: PreviewProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#181819] shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none rounded-2xl p-4">
        <div
          className={`relative transition-all duration-500 ease-in-out overflow-hidden shadow-2xl ${
            viewMode === "mobile" ? "aspect-9/19 w-full max-w-[360px] rounded-[2.5rem] border-4 border-zinc-950" : "h-full w-full rounded-xl border-border border"
          }`}
        >
          <PreviewBackground profile={profile} />

          <div className="relative h-full overflow-y-auto no-scrollbar" style={{ padding: `${profile.padding}px` }}>
            <div className="mx-auto flex w-full max-w-[420px] flex-col items-center pb-10 pt-12">
              <PreviewProfile profile={profile} />
              <PreviewSocials profile={profile} />
              <PreviewLinks profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
