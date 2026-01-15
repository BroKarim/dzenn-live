import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { collectionService } from "@/lib/services/collection.service";
import { db } from "@/lib/db";
import { fetchMetadataFromBackend } from "@/lib/utils/backend-client";
import { fetchAndUploadLinkPreviewImage, getFallbackPreviewImage } from "@/lib/utils/link-preview-image";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const collection = await collectionService.getById(id, userId || undefined);

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ collection });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await req.json();

    const collection = await collectionService.update(id, session.user.id, body);

    if (collection.links && Array.isArray(collection.links)) {
      collection.links.forEach((link: { id: string; url: string; icon?: string | null }) => {
        if (!link.icon) {
          (async () => {
            try {
              const metadata = await fetchMetadataFromBackend(link.url);
              const previewDescription = metadata.description;
              const imageUrl = metadata.image;
              let previewImageUrl: string | null = null;
              
              if (imageUrl && typeof imageUrl === "string") {
                previewImageUrl = await fetchAndUploadLinkPreviewImage(imageUrl, link.id, link.url);
              }
              
              if (!previewImageUrl) {
                previewImageUrl = await getFallbackPreviewImage();
              }

              await db.collectionLink.update({
                where: { id: link.id },
                data: { 
                  previewImageUrl,
                  previewDescription,
                },
              });
            } catch (error) {
              console.error("[Collection Link Preview] Failed to fetch preview:", error);
              try {
                const fallback = await getFallbackPreviewImage();
                if (fallback) {
                  await db.collectionLink.update({
                    where: { id: link.id },
                    data: { previewImageUrl: fallback },
                  });
                }
              } catch (fallbackError) {
                console.error("[Collection Link Preview] Failed to set fallback:", fallbackError);
              }
            }
          })();
        }
      });
    }

    return NextResponse.json({ collection });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error;
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ path: string[]; message: string }> };
      const firstError = zodError.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation failed" },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    await collectionService.delete(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error;
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete collection" },
      { status: 500 }
    );
  }
}

