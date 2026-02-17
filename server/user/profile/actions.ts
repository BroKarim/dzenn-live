// server/user/profile/actions.ts
"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ProfileSchema, ProfileInput } from "./schema";
import { profileEditorPayload } from "./payloads";
import { findProfileByUserId } from "./queries";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ProfileLayout } from "@/lib/generated/prisma/enums";

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

// Helper to get profile ID by user ID - assuming single/primary profile for now
async function getProfileIdOrThrow(userId: string) {
  const profile = await db.profile.findFirst({ where: { userId } });
  if (!profile) throw new Error("Profile not found");
  return profile.id;
}

import { deleteFromS3 } from "@/lib/s3";

// ... existing imports

export async function updateProfile(data: ProfileInput) {
  try {
    const user = await getAuthenticatedUser();
    const validatedData = ProfileSchema.parse(data);

    // 1. Get current profile to check for old avatar
    const currentProfile = await db.profile.findFirst({
      where: { userId: user.id },
      select: { id: true, avatarUrl: true },
    });

    if (!currentProfile) throw new Error("Profile not found");
    const profileId = currentProfile.id;

    // 2. Perform Update
    await db.profile.update({
      where: { id: profileId },
      data: validatedData,
    });

    // 3. Cleanup Old Avatar (Non-blocking)
    if (currentProfile.avatarUrl && validatedData.avatarUrl && currentProfile.avatarUrl !== validatedData.avatarUrl) {
      // Don't await this, let it run in background or handle error silently
      deleteFromS3(currentProfile.avatarUrl).catch((err) => console.error("Failed to delete old avatar:", err));
    }

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

export async function updateLayout(layout: ProfileLayout) {
  try {
    const user = await getAuthenticatedUser();
    const profileId = await getProfileIdOrThrow(user.id);

    const updated = await db.profile.update({
      where: { id: profileId },
      data: { layout },
      select: profileEditorPayload,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update layout" };
  }
}

export async function updateCardTexture(cardTexture: "base" | "glassy") {
  try {
    const user = await getAuthenticatedUser();
    const profileId = await getProfileIdOrThrow(user.id);

    await db.profile.update({
      where: { id: profileId },
      data: { cardTexture },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update card texture" };
  }
}

export async function updateTheme(theme: string) {
  try {
    const user = await getAuthenticatedUser();
    const profileId = await getProfileIdOrThrow(user.id);

    await db.profile.update({
      where: { id: profileId },
      data: { theme },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update theme" };
  }
}

export async function updateBackground(data: { bgType?: "color" | "gradient" | "wallpaper" | "image"; bgColor?: string; bgGradientFrom?: string | null; bgGradientTo?: string | null; bgWallpaper?: string | null; bgImage?: string | null }) {
  try {
    const user = await getAuthenticatedUser();
    const profileId = await getProfileIdOrThrow(user.id);

    await db.profile.update({
      where: { id: profileId },
      data,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update background" };
  }
}

export async function updateBackgroundEffects(effects: { blur: number; noise: number; brightness: number; saturation: number; contrast: number }) {
  try {
    const user = await getAuthenticatedUser();
    const profileId = await getProfileIdOrThrow(user.id);

    await db.profile.update({
      where: { id: profileId },
      data: { bgEffects: effects },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update effects" };
  }
}

export async function updateBackgroundPattern(pattern: { type: string; color: string; opacity: number; thickness: number; scale: number }) {
  try {
    const user = await getAuthenticatedUser();
    const profileId = await getProfileIdOrThrow(user.id);

    await db.profile.update({
      where: { id: profileId },
      data: { bgPattern: pattern },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update pattern" };
  }
}

export async function getProfile() {
  try {
    const user = await getAuthenticatedUser();

    // Queries should be updated to handle non-unique userId too, but assuming findProfileByUserId is updated or we update it separately
    const profile = await findProfileByUserId(user.id);

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    return { success: true, data: profile };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to get profile" };
  }
}
