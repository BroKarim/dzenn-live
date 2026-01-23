import React from "react"
import { TexturedCard } from "@/app/editor/_components.tsx/texture-card"
import { EditorState, LinkItem } from "@/lib/editor"

interface PreviewLinksProps {
  state: EditorState
}

export function PreviewLinks({ state }: PreviewLinksProps) {
  const { links, cardTexture } = state

  return (
    <div className="w-full space-y-4">
      {links && links.length > 0 ? (
        links.map((link: LinkItem) => (
          <TexturedCard
            key={link.id}
            title={link.title.toUpperCase()}
            url={link.url}
            description={link.description}
            imageUrl={link.imageUrl}
            videoUrl={link.videoUrl}
            isStripeEnabled={link.isStripeEnabled}
            backgroundColor={link.backgroundColor || "bg-amber-500"}
            titleColor="text-white"
            texture={cardTexture}
          />
        ))
      ) : (
        <TexturedCard
          title="ADD YOUR FIRST LINK"
          backgroundColor="bg-zinc-800"
          titleColor="text-white"
          texture={cardTexture}
        />
      )}
    </div>
  )
}
