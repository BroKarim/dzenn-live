import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;

  if (session?.user) {
    if (pathname === "/login" || pathname === "/signup") {
      const { db } = await import("@/lib/db");
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { isOnboarded: true },
      });

      const redirectUrl = user?.isOnboarded ? "/dashboard" : "/onboarding/username";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  if (!session?.user) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login", "/signup"],
};

