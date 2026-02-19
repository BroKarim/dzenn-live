"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { deleteFromS3 } from "@/lib/s3";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SaveAllProfileChangesInput {
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  layout?: string | null;
  bgType?: string | null;
  bgColor?: string | null;
  bgGradientFrom?: string | null;
  bgGradientTo?: string | null;
  bgWallpaper?: string | null;
  bgImage?: string | null;
  bgEffects?: { blur: number; noise: number; brightness: number; saturation: number; contrast: number } | null;
  bgPattern?: { type: string; color: string; opacity: number; thickness: number; scale: number } | null;
  cardTexture?: string | null;
}

// ─── Auth Helper ──────────────────────────────────────────────────────────────

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

/**
 * Saves all editor profile changes in a single DB round-trip.
 * Replaces the old separate updateProfile / updateBackground / updateBackgroundEffects
 * / updateBackgroundPattern / updateCardTexture calls that caused connection pool
 * exhaustion on VPS when fired in parallel via Promise.all.
 */
export async function saveAllProfileChanges(data: SaveAllProfileChangesInput) {
  try {
    const user = await getSession();

    const currentProfile = await db.profile.findFirst({
      where: { userId: user.id },
      select: { id: true, avatarUrl: true },
    });

    if (!currentProfile) throw new Error("Profile not found");

    // Build update payload — skip undefined fields to avoid overwriting with null
    const updateData: Record<string, any> = {};
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.layout !== undefined) updateData.layout = data.layout;
    if (data.bgType !== undefined) updateData.bgType = data.bgType;
    if (data.bgColor !== undefined) updateData.bgColor = data.bgColor;
    if (data.bgGradientFrom !== undefined) updateData.bgGradientFrom = data.bgGradientFrom;
    if (data.bgGradientTo !== undefined) updateData.bgGradientTo = data.bgGradientTo;
    if (data.bgWallpaper !== undefined) updateData.bgWallpaper = data.bgWallpaper;
    if (data.bgImage !== undefined) updateData.bgImage = data.bgImage;
    if (data.bgEffects != null) updateData.bgEffects = data.bgEffects;
    if (data.bgPattern != null) updateData.bgPattern = data.bgPattern;
    if (data.cardTexture !== undefined) updateData.cardTexture = data.cardTexture;

    await db.profile.update({
      where: { id: currentProfile.id },
      data: updateData,
    });

    // Non-blocking S3 cleanup for old avatar
    if (data.avatarUrl && currentProfile.avatarUrl && currentProfile.avatarUrl !== data.avatarUrl) {
      deleteFromS3(currentProfile.avatarUrl).catch(console.error);
    }

    revalidatePath(`/${user.username}`);
    return { success: true };
  } catch (error: any) {
    console.error("[profile/actions] saveAllProfileChanges:", error);
    return { success: false, error: error.message || "Failed to save profile" };
  }
}

/**
 * Updates the active theme. Called directly from ThemeSelector component
 * (outside the main Save flow, so it remains a standalone action).
 */
export async function updateTheme(theme: string) {
  try {
    const user = await getSession();

    const profile = await db.profile.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!profile) throw new Error("Profile not found");

    await db.profile.update({
      where: { id: profile.id },
      data: { theme },
    });

    revalidatePath(`/${user.username}`);
    return { success: true };
  } catch (error: any) {
    console.error("[profile/actions] updateTheme:", error);
    return { success: false, error: error.message || "Failed to update theme" };
  }
}
