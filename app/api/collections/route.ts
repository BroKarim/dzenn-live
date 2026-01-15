import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { collectionService } from "@/lib/services/collection.service";
import { db } from "@/lib/db";
import { fetchMetadataFromBackend } from "@/lib/utils/backend-client";
import { fetchAndUploadLinkPreviewImage, getFallbackPreviewImage } from "@/lib/utils/link-preview-image";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const result = await collectionService.getAll({
      category: category || undefined,
      userId: userId || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const collection = await collectionService.create(session.user.id, body);

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

    return NextResponse.json({ collection }, { status: 201 });
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create collection" },
      { status: 500 }
    );
  }
}

