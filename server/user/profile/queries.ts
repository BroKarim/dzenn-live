// server/user/profile/queries.ts
import { db } from "@/lib/db";
import { profileEditorPayload } from "./payloads";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";

export async function getProfileData(userId: string) {
  "use cache";
  cacheTag(`profile-${userId}`);
  cacheLife("max");

  return await db.profile.findUnique({
    where: { userId },
    select: profileEditorPayload,
  });
}

export async function findProfileByUserId(userId: string) {
  return await db.profile.findUnique({
    where: { userId },
    select: profileEditorPayload,
  });
}

export async function findProfileByUsername(username: string) {
  return await db.profile.findFirst({
    where: { user: { username } },
    select: profileEditorPayload,
  });
}
