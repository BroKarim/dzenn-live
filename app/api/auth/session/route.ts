import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json({ session: null }, { status: 401 });
  }
}
