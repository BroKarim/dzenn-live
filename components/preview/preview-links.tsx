import React from "react";
import { TexturedCard } from "@/components/texture-card";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface PreviewLinksProps {
  profile: ProfileEditorData;
}

export function PreviewLinks({ profile }: PreviewLinksProps) {
  const { links, cardTexture } = profile;

  return (
    <div className="w-full space-y-4">
      {links && links.length > 0 ? (
        links.map((link) => (
          <TexturedCard
            key={link.id}
            title={link.title.toUpperCase()}
            url={link.url}
            description={link.description ?? undefined}
            imageUrl={link.mediaType === "image" ? (link.mediaUrl ?? undefined) : undefined}
            videoUrl={link.mediaType === "video" ? (link.mediaUrl ?? undefined) : undefined}
            isStripeEnabled={!!link.paymentProvider}
            backgroundColor="bg-amber-500"
            titleColor="text-white"
            texture={cardTexture}
          />
        ))
      ) : (
        <TexturedCard title="ADD YOUR FIRST LINK" backgroundColor="bg-zinc-800" titleColor="text-white" texture={cardTexture} />
      )}
    </div>
  );
}
