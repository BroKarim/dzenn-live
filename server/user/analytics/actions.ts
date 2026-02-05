"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { linkStatsQuerySchema, profileStatsQuerySchema, linkClickCountQuerySchema, linksClickCountsQuerySchema } from "./schema";
import { getLinkStats, getProfileStats, getLinkClickCount, getLinksClickCounts } from "./queries";
import type { LinkStatsData, ProfileStatsData, LinksClickCounts } from "./payloads";

// ===========================
// Action: Get Link Analytics
// ===========================
export async function getLinkAnalyticsAction(params: { linkId: string; startDate?: string; endDate?: string; includeBots?: boolean }): Promise<{ success: true; data: LinkStatsData } | { success: false; error: string }> {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Parse and validate input
    const validated = linkStatsQuerySchema.safeParse({
      linkId: params.linkId,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      includeBots: params.includeBots ?? false,
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // Check if user owns the link
    const link = await db.link.findFirst({
      where: {
        id: validated.data.linkId,
        profile: {
          userId: session.user.id,
        },
      },
    });

    if (!link) {
      return { success: false, error: "Link not found or unauthorized" };
    }

    // Get analytics
    const stats = await getLinkStats(validated.data.linkId, validated.data.startDate, validated.data.endDate, validated.data.includeBots);

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getLinkAnalyticsAction:", error);
    return { success: false, error: "Failed to fetch link analytics" };
  }
}

// ===========================
// Action: Get Profile Analytics
// ===========================
export async function getProfileAnalyticsAction(params: { startDate?: string; endDate?: string; includeBots?: boolean }): Promise<{ success: true; data: ProfileStatsData } | { success: false; error: string }> {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's profile
    const profile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return {
        success: false,
        error: "Profile not found",
      };
    }

    // Parse and validate input
    const validated = profileStatsQuerySchema.safeParse({
      profileId: profile.id,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      includeBots: params.includeBots ?? false,
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // Get analytics
    const stats = await getProfileStats(validated.data.profileId, validated.data.startDate, validated.data.endDate, validated.data.includeBots);

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getProfileAnalyticsAction:", error);
    return { success: false, error: "Failed to fetch profile analytics" };
  }
}

// ===========================
// Action: Get Link Click Count
// ===========================
export async function getLinkClickCountAction(params: { linkId: string; includeBots?: boolean }): Promise<{ success: true; count: number } | { success: false; error: string }> {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validated = linkClickCountQuerySchema.safeParse({
      linkId: params.linkId,
      includeBots: params.includeBots ?? false,
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // Check if user owns the link
    const link = await db.link.findFirst({
      where: {
        id: validated.data.linkId,
        profile: {
          userId: session.user.id,
        },
      },
    });

    if (!link) {
      return { success: false, error: "Link not found or unauthorized" };
    }

    // Get count
    const count = await getLinkClickCount(validated.data.linkId, validated.data.includeBots);

    return { success: true, count };
  } catch (error) {
    console.error("Error in getLinkClickCountAction:", error);
    return { success: false, error: "Failed to fetch link click count" };
  }
}

// ===========================
// Action: Get Multiple Links Click Counts
// ===========================
export async function getLinksClickCountsAction(params: { includeBots?: boolean }): Promise<{ success: true; counts: LinksClickCounts } | { success: false; error: string }> {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's profile and links
    const profile = await db.profile.findFirst({
      where: { userId: session.user.id },
      include: {
        links: {
          select: { id: true },
        },
      },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    const linkIds = profile.links.map((l) => l.id);

    if (linkIds.length === 0) {
      return { success: true, counts: {} };
    }

    // Validate input
    const validated = linksClickCountsQuerySchema.safeParse({
      linkIds,
      includeBots: params.includeBots ?? false,
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // Get counts
    const counts = await getLinksClickCounts(validated.data.linkIds, validated.data.includeBots);

    return { success: true, counts };
  } catch (error) {
    console.error("Error in getLinksClickCountsAction:", error);
    return { success: false, error: "Failed to fetch links click counts" };
  }
}
