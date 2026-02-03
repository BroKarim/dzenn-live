import React from "react";
import { TexturedCard } from "@/components/texture-card";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface PreviewLinksProps {
  profile: ProfileEditorData;
}

export function PreviewLinks({ profile }: PreviewLinksProps) {
  const { links, cardTexture } = profile;

  // Sort links by position for correct display order
  const sortedLinks = links ? [...links].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];

  return (
    <div className="w-full space-y-4">
      {sortedLinks.length > 0 ? (
        sortedLinks.map((link) => (
          <TexturedCard
            key={link.id}
            title={link.title.toUpperCase()}
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
        ))
      ) : (
        <TexturedCard title="ADD YOUR FIRST LINK" backgroundColor="" titleColor="text-white" texture={cardTexture} />
      )}
    </div>
  );
}
