import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { profileService } from "@/lib/services/profile.service";
import { linkService } from "@/lib/services/link.service";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { username, links } = body;

    let profile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      profile = await db.profile.create({
        data: { userId: session.user.id },
      });
    }

    if (username) {
      await profileService.updateUsername(session.user.id, username);
    }

    if (links && Array.isArray(links) && links.length > 0) {
      await db.link.deleteMany({
        where: { profileId: profile.id },
      });

      await Promise.all(
        links.map(
          async (
            link: { title: string; url: string; icon?: string },
            index: number
          ) => {
            const created = await linkService.create(profile.id, {
              title: link.title,
              url: link.url,
              icon: link.icon,
            });

            return db.link.update({
              where: { id: created.id },
              data: { position: index },
            });
          }
        )
      );
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { isOnboarded: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error;
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

