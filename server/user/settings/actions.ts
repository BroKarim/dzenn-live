"use server"

import {db} from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getOnboardingStatus() {
const session = await auth.api.getSession({
       headers: await headers()
     });
  if (!session?.user) return { isOnboarded: false };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isOnboarded: true, username: true }
  });

  return {
    isOnboarded: user?.isOnboarded ?? false,
    username: user?.username
  };
}

export async function checkUsernameAvailability(username: string) {
  const existing = await db.user.findUnique({
    where: { username: username.toLowerCase() },
  });
  return !existing;
}

export async function setupUsername(username: string) {
  const session = await auth.api.getSession({
      headers: await headers()
    });
  if (!session?.user) throw new Error("Unauthorized");

  const formattedUsername = username.toLowerCase();

  // Update User & Create Initial Profile in one transaction
  await db.$transaction([
    db.user.update({
      where: { id: session.user.id },
      data: { 
        username: formattedUsername,
        isOnboarded: true 
      },
    }),
    db.profile.create({
      data: {
        userId: session.user.id,
        displayName: session.user.name || formattedUsername,
        // Default design state bisa ditaruh di sini
      }
    })
  ]);

  revalidatePath("/dashboard");
  return { success: true, username: formattedUsername };
}