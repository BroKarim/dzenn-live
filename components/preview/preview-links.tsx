import React from "react";
import { TexturedCard } from "@/components/texture-card";
import type { CardTexture } from "@/lib/generated/prisma/client";

interface PreviewLinksProps {
  profile: {
    links: any[];
    cardTexture: CardTexture;
  };
  renderLink?: (link: any, children: React.ReactNode) => React.ReactNode;
}

export function PreviewLinks({ profile, renderLink }: PreviewLinksProps) {
  const { links, cardTexture } = profile;

  // Sort links by position for correct display order
  const sortedLinks = links ? [...links].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];

  return (
    <div className="w-full space-y-4">
      {sortedLinks.length > 0 ? (
        sortedLinks.map((link) => {
          const card = (
            <TexturedCard
              key={link.id}
              title={link.title}
              url={link.url}
              description={link.description ?? undefined}
              icon={link.icon ?? undefined}
              imageUrl={link.mediaType === "image" ? (link.mediaUrl ?? undefined) : undefined}
              videoUrl={link.mediaType === "video" ? (link.mediaUrl ?? undefined) : undefined}
              isStripeEnabled={!!link.paymentProvider}
              backgroundColor="bg-[#222]"
              titleColor="text-white"
              texture={cardTexture}
            />
          );

          if (renderLink) {
            return <React.Fragment key={link.id}>{renderLink(link, card)}</React.Fragment>;
          }

          return card;
        })
      ) : (
        <TexturedCard title="ADD YOUR FIRST LINK" backgroundColor="" titleColor="text-white" texture={cardTexture} />
      )}
    </div>
  );
}
