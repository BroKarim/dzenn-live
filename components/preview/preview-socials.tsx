import React from "react";
import { Globe } from "lucide-react";
import { SOCIAL_PLATFORMS } from "@/lib/sosmed";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface PreviewSocialsProps {
  profile: ProfileEditorData;
}

export function PreviewSocials({ profile }: PreviewSocialsProps) {
  if (!profile.socials || profile.socials.length === 0) return null;

  return (
    <div className="mb-8 w-full">
      <div className="no-scrollbar flex w-full flex-row items-center justify-center gap-4 overflow-x-auto pb-2">
        {profile.socials.map((social) => {
          const platform = SOCIAL_PLATFORMS.find((p) => p.id === social.platform);
          const Icon = platform?.icon || Globe;

          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95 border border-white/10"
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
