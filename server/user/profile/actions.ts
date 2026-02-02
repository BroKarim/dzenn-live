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

export async function updateProfile(data: ProfileInput) {
  try {
    const user = await getAuthenticatedUser();
    const validatedData = ProfileSchema.parse(data);

    const updatedProfile = await db.profile.update({
      where: { userId: user.id },
      data: validatedData,
      select: profileEditorPayload,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true, data: updatedProfile };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

export async function updateLayout(layout: ProfileLayout) {
  try {
    const user = await getAuthenticatedUser();

    const updatedProfile = await db.profile.update({
      where: { userId: user.id },
      data: { layout },
      select: profileEditorPayload,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true, data: updatedProfile };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update layout" };
  }
}

export async function updateBackground(data: { bgType?: "color" | "gradient" | "wallpaper" | "image"; bgColor?: string; bgGradientFrom?: string | null; bgGradientTo?: string | null; bgWallpaper?: string | null; bgImage?: string | null }) {
  try {
    const user = await getAuthenticatedUser();

    const updatedProfile = await db.profile.update({
      where: { userId: user.id },
      data,
      select: profileEditorPayload,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${user.username}`);

    return { success: true, data: updatedProfile };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update background" };
  }
}

export async function getProfile() {
  try {
    const user = await getAuthenticatedUser();

    const profile = await findProfileByUserId(user.id);

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    return { success: true, data: profile };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to get profile" };
  }
}
