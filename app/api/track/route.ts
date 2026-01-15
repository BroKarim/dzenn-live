import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { trackingService } from "@/lib/services/tracking.service";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { linkId, clientId } = await req.json();

    if (!linkId) {
      return NextResponse.json(
        { error: "Missing linkId" },
        { status: 400 }
      );
    }

    const link = await db.link.findUnique({
      where: { id: linkId },
      select: { id: true, isActive: true },
    });

    if (!link || !link.isActive) {
      return NextResponse.json(
        { error: "Link not found or inactive" },
        { status: 404 }
      );
    }

    const headersList = await headers();
    const dnt = headersList.get("dnt");
    
    if (dnt === "1") {
      return NextResponse.json({ 
        success: true, 
        tracked: false, 
        reason: "do_not_track" 
      });
    }

    const referrer = headersList.get("referer") || null;
    const userAgent = headersList.get("user-agent") || null;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                      headersList.get("x-real-ip") ||
                      null;

    const country = headersList.get("cf-ipcountry") || 
                    headersList.get("x-vercel-ip-country") || 
                    null;

    const url = new URL(req.url);
    const fullUrl = `${url.origin}${url.pathname}${url.search}`;

    const allHeaders: Record<string, string | null> = {
      "accept-language": headersList.get("accept-language"),
      "accept-encoding": headersList.get("accept-encoding"),
    };

    const result = await trackingService.trackClickWithRetry({
      linkId,
      ipAddress,
      userAgent,
      referrer,
      country,
      headers: allHeaders,
      clientId: clientId || undefined,
      url: fullUrl,
    });

    if (!result.success && result.reason === "max_retries_exceeded") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Tracking temporarily unavailable",
          retry: true 
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: result.success,
      tracked: result.tracked,
      reason: result.reason,
      idempotencyKey: result.idempotencyKey,
    });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to track click",
        retry: true 
      },
      { status: 500 }
    );
  }
}

