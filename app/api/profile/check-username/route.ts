import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { profileService } from "@/lib/services/profile.service";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const available = await profileService.checkUsernameAvailable(
      username,
      session?.user?.id
    );

    return NextResponse.json({ available });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid username" },
      { status: 400 }
    );
  }
}
