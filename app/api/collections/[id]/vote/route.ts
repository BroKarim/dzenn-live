import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { collectionService } from "@/lib/services/collection.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await req.json();

    if (!body.voteType || !["UP", "DOWN"].includes(body.voteType)) {
      return NextResponse.json(
        { error: "Invalid vote type. Must be UP or DOWN" },
        { status: 400 }
      );
    }

    const result = await collectionService.vote(id, session.user.id, body.voteType);
    const collection = await collectionService.getById(id, session.user.id);

    return NextResponse.json({ 
      success: true,
      action: result.action,
      collection,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error;
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to vote" },
      { status: 500 }
    );
  }
}

