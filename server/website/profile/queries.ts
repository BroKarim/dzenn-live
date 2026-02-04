import { db } from "@/lib/db";
import { publicProfilePayload } from "./payloads";
import { cacheLife, cacheTag } from "next/cache";

export async function getPublicProfile(username: string) {
  "use cache";
  cacheTag(`public-profile-${username}`);
  cacheLife("minutes"); // Public profile can be cached for few minutes

  return await db.user.findUnique({
    where: { username },
    select: publicProfilePayload,
  });
}
