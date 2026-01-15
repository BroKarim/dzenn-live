import Image from "next/image";
import Link from "next/link";
import { profileService } from "@/lib/services/profile.service";
import { getAvatarUrl } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipProvider,
} from "@/components/ui/tooltip";

export async function TrustedBy() {
  const profiles = await profileService.getPublishedProfiles(9);

  const avatarData = profiles
    .map((user) => {
      const avatarUrl = getAvatarUrl(user);
      if (!avatarUrl || !user.username) return null;
      return {
        imageUrl: avatarUrl,
        profileUrl: `/${user.username}`,
        name: user.username,
      };
    })
    .filter((item): item is { imageUrl: string; profileUrl: string; name: string } => item !== null);

  if (avatarData.length === 0) {
    return null;
  }

  return (
    <section className="border-t-2 border-dashed border-zinc-200 pt-24 md:pt-32 pb-24 md:pb-32 bg-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-zinc-500">TRUSTED BY</p>
            <h2 className="text-2xl md:text-3xl font-medium">People who use OneURL</h2>
          </div>
          <TooltipProvider>
            <div className="relative grid grid-cols-5 md:grid-cols-10 gap-0.5 sm:gap-0.5 md:gap-0 p-2 justify-center">
              {avatarData.map((item, index) => (
                <div key={index} className="relative group" style={{ opacity: 1, transform: "none" }}>
                  <div style={{ transform: "none" }}>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Link
                            href={item.profileUrl}
                            className="block size-14 sm:size-16 md:size-16 rounded-full bg-zinc-100 cursor-pointer transition-all border border-zinc-200/80 hover:ring-zinc-300 shadow-sm hover:shadow-md relative overflow-hidden hover:rotate-3"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              alt={item.name}
                              src={item.imageUrl}
                              width={64}
                              height={64}
                              className="rounded-full select-none w-full h-full object-cover"
                              draggable={false}
                              loading="lazy"
                            />
                          </Link>
                        }
                      />
                      <TooltipPopup>@{item.name}</TooltipPopup>
                    </Tooltip>
                  </div>
                </div>
              ))}
              <div className="relative group" style={{ opacity: 1, transform: "none" }}>
                <div>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link
                          href="/signup"
                          className="size-14 sm:size-16 md:size-16 rounded-full bg-zinc-100 cursor-pointer transition-all border border-zinc-200/80 ring-dashed hover:ring-zinc-400 shadow-sm hover:shadow-md relative overflow-hidden flex items-center justify-center"
                        >
                          <span className="text-zinc-400 font-medium text-base">+</span>
                        </Link>
                      }
                    />
                    <TooltipPopup>Join OneURL</TooltipPopup>
                  </Tooltip>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
}

