import Image from "next/image";
import { UsernameClaimForm } from "./username-claim-form";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { profileService } from "@/lib/services/profile.service";
import { getAvatarUrl } from "@/lib/utils";

export async function LandingHero() {
  const [profiles, totalCount] = await Promise.all([
    profileService.getPublishedProfiles(5),
    profileService.getPublishedProfileCount(),
  ]);

  const avatarData = profiles
    .map((user) => {
      const avatarUrl = getAvatarUrl(user);
      if (!avatarUrl || !user.username) return null;
      return {
        imageUrl: avatarUrl,
        profileUrl: `/${user.username}`,
      };
    })
    .filter((item): item is { imageUrl: string; profileUrl: string } => item !== null);

  const remainingCount = Math.max(0, totalCount - avatarData.length);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">
            One URL for all your links
          </h1>
          <p className="text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto">
            Create a beautiful profile page to share all your important links in one place. Open source alternative to Linktree.
          </p>
          <div className="pt-2 flex justify-center items-center gap-4 flex-wrap">
            <a
              href="https://www.producthunt.com/products/oneurl?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-oneurl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                alt="OneURL - OneURL for all your links, open-source alternative linktree | Product Hunt"
                width="250"
                height="54"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1057991&theme=light&t=1767507366892"
              />
            </a>
            <a
              href="https://peerlist.io/code_kartik/project/oneurl--one-url-for-all-your-links"
              target="_blank"
              rel="noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://peerlist.io/api/v1/projects/embed/PRJHQ7MKJOM6JPMLRIO6BB7Q7EMRLR?showUpvote=true&theme=light"
                alt="OneURL - One URL for all your links"
                className="h-[60px] w-auto"
              />
            </a>
          </div>
        </div>
        {avatarData.length > 0 && (
          <div className="flex flex-col items-center gap-3 pt-4">
            <div className="flex items-center gap-2">
              <AvatarCircles
                avatarUrls={avatarData}
                numPeople={remainingCount}
              />
              <span className="text-xs text-zinc-600">
                {totalCount.toLocaleString()} {totalCount === 1 ? "person" : "people"} have created their profile
              </span>
            </div>
          </div>
        )}
        <div className="pt-8 flex justify-center">
          <UsernameClaimForm />
        </div>
      </div>
      
      <div className="mt-16 md:mt-24 flex justify-center">
        <div className="rounded-xl bg-zinc-900/5 ring-1 ring-inset ring-zinc-900/10 lg:rounded-2xl border border-zinc-200 w-full max-w-5xl">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 border-b border-zinc-200 rounded-t-xl lg:rounded-t-2xl">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF605C]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD44]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#00CA4E]"></div>
            </div>
            <div className="text-xs text-zinc-500">oneurl.live</div>
          </div>
          <div className="relative w-full">
            <Image
              alt="OneURL preview"
              src="/hero.png"
              width={1364}
              height={866}
              className="select-none rounded-b-xl lg:rounded-b-2xl bg-white w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

