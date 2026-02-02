"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { SocialLinkSchema, LinkSchema, SocialLinkInput, LinkInput } from "./schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";
import { optimizeImage } from "@/lib/media";

// ============= SOCIAL LINKS =============

export async function createSocialLink(data: SocialLinkInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    const validatedData = SocialLinkSchema.parse(data);

    const socialLink = await db.socialLink.create({
      data: {
        ...validatedData,
        profileId: profile.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${session.user.username}`);

    return { success: true, data: socialLink };
  } catch (error) {
    console.error("Failed to create social link:", error);
    return { success: false, error: "Failed to create social link" };
  }
}

export async function updateSocialLink(id: string, data: SocialLinkInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = SocialLinkSchema.parse(data);

    const socialLink = await db.socialLink.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${session.user.username}`);

    return { success: true, data: socialLink };
  } catch (error) {
    console.error("Failed to update social link:", error);
    return { success: false, error: "Failed to update social link" };
  }
}

export async function deleteSocialLink(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await db.socialLink.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${session.user.username}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete social link:", error);
    return { success: false, error: "Failed to delete social link" };
  }
}

// ============= LINKS =============

export async function createLink(data: LinkInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    const validatedData = LinkSchema.parse(data);

    const link = await db.link.create({
      data: {
        ...validatedData,
        profileId: profile.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${session.user.username}`);

    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to create link:", error);
    return { success: false, error: "Failed to create link" };
  }
}

export async function updateLink(id: string, data: Partial<LinkInput>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch existing link to check for files to delete
    const existingLink = await db.link.findUnique({
      where: { id },
      select: { icon: true, mediaUrl: true },
    });

    if (!existingLink) {
      return { success: false, error: "Link not found" };
    }

    // Delete old icon if updated
    if (data.icon && existingLink.icon && data.icon !== existingLink.icon) {
      await deleteFromS3(existingLink.icon);
    }

    // Delete old media if updated
    if (data.mediaUrl && existingLink.mediaUrl && data.mediaUrl !== existingLink.mediaUrl) {
      await deleteFromS3(existingLink.mediaUrl);
    }

    const link = await db.link.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${session.user.username}`);

    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { success: false, error: "Failed to update link" };
  }
}

export async function deleteLink(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch link to delete its files from S3
    const link = await db.link.findUnique({
      where: { id },
      select: { icon: true, mediaUrl: true },
    });

    if (link) {
      if (link.icon) await deleteFromS3(link.icon);
      if (link.mediaUrl) await deleteFromS3(link.mediaUrl);
    }

    await db.link.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${session.user.username}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error: "Failed to delete link" };
  }
}

// ============= UPLOADS =============

export async function uploadLinkIcon(base64: string, fileName: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const { uploadBase64ToS3 } = await import("@/lib/s3");
    const url = await uploadBase64ToS3(base64, fileName);

    return { success: true, url };
  } catch (error) {
    console.error("Failed to upload icon:", error);
    return { success: false, error: "Failed to upload icon" };
  }
}

export async function uploadLinkMedia(base64: string, fileName: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const { uploadBase64ToS3 } = await import("@/lib/s3");
    const url = await uploadBase64ToS3(base64, fileName);

    return { success: true, url };
  } catch (error) {
    console.error("Failed to upload media:", error);
    return { success: false, error: "Failed to upload media" };
  }
}

export async function uploadMedia(base64: string, fileName: string, type: "icon" | "media") {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { success: false, error: "Unauthorized" };

    // 1. Optimize
    const optimizedBuffer = await optimizeImage(base64, type);

    // 2. Format FileName agar unik dan ekstensi jadi .webp
    const cleanName = `${Date.now()}-${fileName.split(".")[0]}.webp`;
    const folder = type === "icon" ? "icons" : "media";

    // 3. Upload ke S3 (Gunakan buffer, bukan base64 string lagi untuk efisiensi)
    const url = await uploadToS3(optimizedBuffer, `${folder}/${cleanName}`, "image/webp");

    return { success: true, url };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "Processing failed" };
  }
}
