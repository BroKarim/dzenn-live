import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { analyticsService } from "@/lib/services/analytics.service";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ counts: {} });
    }

    const links = await db.link.findMany({
      where: { profileId: profile.id },
      select: { id: true },
    });

    const linkIds = links.map((l) => l.id);
    const counts = await analyticsService.getLinksClickCounts(linkIds);

    return NextResponse.json({ counts });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error;
    }
    console.error("Error fetching link counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch link counts" },
      { status: 500 }
    );
  }
}

