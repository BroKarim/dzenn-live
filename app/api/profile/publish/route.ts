import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { profileService } from "@/lib/services/profile.service";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { profile: { include: { links: true } } },
    });

    if (!user?.username) {
      return NextResponse.json(
        { error: "Please complete username step first" },
        { status: 400 }
      );
    }

    if (!user.profile || user.profile.links.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one link" },
        { status: 400 }
      );
    }

    await profileService.publishProfile(session.user.id);
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
      { error: "Failed to publish profile" },
      { status: 500 }
    );
  }
}

