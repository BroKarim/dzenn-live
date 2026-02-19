"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { SocialLinkSchema, LinkSchema, SocialLinkInput, LinkInput } from "./schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { deleteFromS3 } from "@/lib/s3";

// ─── Auth Helper ──────────────────────────────────────────────────────────────

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

async function getProfileId(userId: string) {
  const profile = await db.profile.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (!profile) throw new Error("Profile not found");
  return profile.id;
}

function withAuth<TArgs extends any[], TReturn>(fn: (user: Awaited<ReturnType<typeof getSession>>, ...args: TArgs) => Promise<TReturn>) {
  return async (...args: TArgs): Promise<{ success: true; data?: any } | { success: false; error: string }> => {
    try {
      const user = await getSession();
      return (await fn(user, ...args)) as any;
    } catch (error: any) {
      console.error(`[links/actions] ${error.message}`);
      return { success: false, error: error.message || "An error occurred" };
    }
  };
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export const createSocialLink = withAuth(async (user, data: SocialLinkInput) => {
  const profileId = await getProfileId(user.id);
  const validated = SocialLinkSchema.parse(data);

  const socialLink = await db.socialLink.create({
    data: { ...validated, profileId },
  });

  revalidatePath(`/${user.username}`);
  return { success: true, data: socialLink };
});

export const updateSocialLink = withAuth(async (user, id: string, data: SocialLinkInput) => {
  const validated = SocialLinkSchema.parse(data);

  await db.socialLink.update({ where: { id }, data: validated });

  revalidatePath(`/${user.username}`);
  return { success: true };
});

export const deleteSocialLink = withAuth(async (user, id: string) => {
  // deleteMany avoids P2025 if record was already deleted
  await db.socialLink.deleteMany({ where: { id } });

  revalidatePath(`/${user.username}`);
  return { success: true };
});

// ─── Links ────────────────────────────────────────────────────────────────────

export const createLink = withAuth(async (user, data: LinkInput) => {
  const profileId = await getProfileId(user.id);
  const validated = LinkSchema.parse(data);

  const link = await db.link.create({
    data: { ...validated, profileId },
  });

  revalidatePath(`/${user.username}`);
  return { success: true, data: link };
});

export const updateLink = withAuth(async (user, id: string, data: Partial<LinkInput>) => {
  const existing = await db.link.findUnique({
    where: { id },
    select: { icon: true, mediaUrl: true },
  });

  if (!existing) throw new Error("Link not found");

  // Delete old S3 assets if replaced (non-blocking)
  if (data.icon && existing.icon && data.icon !== existing.icon) {
    deleteFromS3(existing.icon).catch(console.error);
  }
  if (data.mediaUrl && existing.mediaUrl && data.mediaUrl !== existing.mediaUrl) {
    deleteFromS3(existing.mediaUrl).catch(console.error);
  }

  await db.link.update({ where: { id }, data });

  revalidatePath(`/${user.username}`);
  return { success: true };
});

export const deleteLink = withAuth(async (user, id: string) => {
  const link = await db.link.findUnique({
    where: { id },
    select: { icon: true, mediaUrl: true },
  });

  // Guard: record may already be gone (e.g. duplicate save scenario)
  if (!link) return { success: true };

  // Delete S3 assets first (non-blocking)
  if (link.icon) deleteFromS3(link.icon).catch(console.error);
  if (link.mediaUrl) deleteFromS3(link.mediaUrl).catch(console.error);

  // deleteMany avoids P2025 if record was already deleted between the findUnique and delete
  await db.link.deleteMany({ where: { id } });

  revalidatePath(`/${user.username}`);
  return { success: true };
});

export const reorderLinks = withAuth(async (user, linkIds: string[]) => {
  // updateMany silently skips missing IDs instead of throwing P2025
  await db.$transaction(linkIds.map((id, index) => db.link.updateMany({ where: { id }, data: { position: index } })));

  revalidatePath(`/${user.username}`);
  return { success: true };
});
