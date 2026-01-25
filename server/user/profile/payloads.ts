import type { Prisma } from "@/lib/generated/prisma/client";

export const profileEditorPayload = {
  id: true,
  userId: true,
  slug: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  layout: true,
  bgType: true,
  bgColor: true,
  bgGradientFrom: true,
  bgGradientTo: true,
  bgWallpaper: true,
  bgImage: true,
  blurAmount: true,
  padding: true,
  cardTexture: true,
  bgEffects: true,
  isPublished: true,
  socials: {
    select: {
      id: true,
      platform: true,
      url: true,
      position: true,
    },
    orderBy: { position: "asc" as const },
  },
  links: {
    select: {
      id: true,
      title: true,
      url: true,
      icon: true,
      description: true,
      imageUrl: true,
      videoUrl: true,
      isStripeEnabled: true,
      position: true,
      isActive: true,
    },
    where: { isActive: true },
    orderBy: { position: "asc" as const },
  },
} satisfies Prisma.ProfileSelect;

export const profilePublicPayload = {
  slug: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  layout: true,
  bgType: true,
  bgColor: true,
  bgGradientFrom: true,
  bgGradientTo: true,
  bgWallpaper: true,
  bgImage: true,
  blurAmount: true,
  padding: true,
  cardTexture: true,
  bgEffects: true,
  socials: {
    select: {
      platform: true,
      url: true,
      position: true,
    },
    orderBy: { position: "asc" as const },
  },
  links: {
    select: {
      title: true,
      url: true,
      icon: true,
      description: true,
      imageUrl: true,
      videoUrl: true,
      isStripeEnabled: true,
      position: true,
    },
    where: { isActive: true },
    orderBy: { position: "asc" as const },
  },
} satisfies Prisma.ProfileSelect;

export type ProfileEditorData = Prisma.ProfileGetPayload<{
  select: typeof profileEditorPayload;
}>;

export type ProfilePublicData = Prisma.ProfileGetPayload<{
  select: typeof profilePublicPayload;
}>;
