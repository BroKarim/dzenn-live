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

export async function updateProfile(data: ProfileInput) {
  try {
    const user = await getAuthenticatedUser();
    const validatedData = ProfileSchema.parse(data);
    const profileId = await getProfileIdOrThrow(user.id);

    await db.profile.update({
      where: { id: profileId },
      data: validatedData,
    });

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
