import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();
    
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isOnboarded: true },
    });

    return NextResponse.json({ 
      isOnboarded: user?.isOnboarded || false 
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error;
    }
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    );
  }
}

