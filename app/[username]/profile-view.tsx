"use client";

import { useEffect } from "react";
import { PreviewBackground, PreviewProfile, PreviewSocials, PreviewLinks } from "@/components/preview";
import LinkClickTracker from "./link-click-tracker";
import { ProfileHeaderButtons } from "./profile-header-buttons";
import { getThemeById } from "@/lib/themes";

export function ProfileView({ user: profile }: { user: any }) {
  const avatarUrl = profile.avatarUrl || null;
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
    <div
      className="relative min-h-screen w-full overflow-x-hidden transition-colors duration-300"
      style={
        {
          ...theme.variables,
          fontFamily: theme.variables["--font-sans"],
        } as React.CSSProperties
      }
    >
      <PreviewBackground profile={profile} />

      <div className="relative z-10 min-h-screen" style={{ padding: `${profile.padding || 32}px` }}>
        <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-8">
          <ProfileHeaderButtons name={profile.user?.name} username={profile.username} avatarUrl={avatarUrl} />
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-col items-center pb-24 pt-12 space-y-4">
          <PreviewProfile profile={profile} isFullBio={true} />
          <PreviewSocials profile={profile} />
          <PreviewLinks
            profile={profile}
            renderLink={(link, card) => (
              <LinkClickTracker key={link.id} linkId={link.id}>
                {card}
              </LinkClickTracker>
            )}
          />
        </div>
      </div>
    </div>
  );
}
