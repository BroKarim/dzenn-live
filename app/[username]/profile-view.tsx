"use client";

import { PreviewBackground, PreviewProfile, PreviewSocials, PreviewLinks } from "@/components/preview";
import LinkClickTracker from "./link-click-tracker";
import { ProfileHeaderButtons } from "./profile-header-buttons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProfileView({ user }: { user: any }) {
  const profile = user.profile;
  const avatarUrl = profile.avatarUrl || null;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#181819]">
      {/* Mobile device frame container - matches editor preview */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[360px] aspect-9/19 rounded-[2.5rem] border-4 border-zinc-950 overflow-hidden shadow-2xl">
          {/* Background layer */}
          <PreviewBackground profile={profile} />

          {/* Header positioned absolutely at top */}
          <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-8">
            <ProfileHeaderButtons name={user.name} username={user.username} avatarUrl={avatarUrl} />
          </div>

          {/* Scrollable content area - matches editor preview */}
          <div className="relative h-full overflow-y-auto no-scrollbar" style={{ padding: `${profile.padding || 32}px` }}>
            <div className="mx-auto flex w-full max-w-[420px] flex-col items-center pb-10 pt-12">
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

              {/* Branding/CTA at bottom */}
              <div className="mt-12 flex flex-col items-center gap-4">
                <Link href="/" className="font-bold text-lg tracking-tighter text-white/50 hover:text-white transition-opacity">
                  oh<span className="text-primary text-xl">!</span>
                </Link>

                <Link href="/signup">
                  <Button variant="secondary" className="rounded-full px-6 h-10 text-xs font-semibold shadow-xl border-white/5 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
                    Create your own page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
