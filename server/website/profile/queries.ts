import { db } from "@/lib/db";
import { publicProfilePayload } from "./payloads";
import { cacheLife, cacheTag } from "next/cache";

export async function getPublicProfile(username: string) {
  "use cache";
  cacheTag(`public-profile-${username}`);
  cacheLife("minutes"); // Public profile can be cached for few minutes

  return await db.profile.findUnique({
    where: { username },
    select: publicProfilePayload,
  });
}

export async function getPublishedProfiles(limit?: number, offset?: number) {
  "use cache";
  cacheTag("published-profiles");
  cacheLife("minutes");

  return await db.profile.findMany({
    where: {
      isPublished: true,
    },
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    ...(limit ? { take: limit } : {}),
    ...(offset ? { skip: offset } : {}),
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPublishedProfileCount() {
  "use cache";
  cacheTag("published-profiles-count");
  cacheLife("minutes");

  return await db.profile.count({
    where: {
      isPublished: true,
    },
  });
}
