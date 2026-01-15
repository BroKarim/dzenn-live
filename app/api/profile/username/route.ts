import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { profileService } from "@/lib/services/profile.service";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    await profileService.updateUsername(session.user.id, username);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error;
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to set username" },
      { status: 400 }
    );
  }
}

