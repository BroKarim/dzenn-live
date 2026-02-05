"use client";

import { Save, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DomainView } from "@/components/domain-view";
import { ModeSwitcher } from "@/components/mode-switcher";
import { ProfileEditorData } from "@/server/user/profile/payloads";
import { useEditorStore } from "@/lib/stores/editor-store";
import { useTransition } from "react";
import { updateProfile, updateBackground, updateBackgroundEffects, updateBackgroundPattern, updateCardTexture } from "@/server/user/profile/actions";
import { createLink, updateLink, deleteLink, reorderLinks, createSocialLink, updateSocialLink, deleteSocialLink } from "@/server/user/links/actions";
import { toast } from "sonner";

interface EditorHeaderProps {
  profile: ProfileEditorData;
}

export default function EditorHeader({ profile }: EditorHeaderProps) {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "dzenn.link").replace(/https?:\/\//, "");
  const username = profile.username || "user";
  const fullUrl = `${baseUrl}/${username}`;

  const { isDirty, markAsSaved, originalProfile, draftProfile } = useEditorStore();
  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    if (!draftProfile || !isDirty) return;

    startTransition(async () => {
      const toastId = toast.loading("Saving changes...");

      try {
        const updates = [];

        // Profile basic fields
        if (draftProfile.displayName !== originalProfile?.displayName || draftProfile.bio !== originalProfile?.bio || draftProfile.avatarUrl !== originalProfile?.avatarUrl || draftProfile.layout !== originalProfile?.layout) {
          updates.push(updateProfile(draftProfile as any));
        }

        // Background
        if (
          draftProfile.bgType !== originalProfile?.bgType ||
          draftProfile.bgColor !== originalProfile?.bgColor ||
          draftProfile.bgGradientFrom !== originalProfile?.bgGradientFrom ||
          draftProfile.bgGradientTo !== originalProfile?.bgGradientTo ||
          draftProfile.bgWallpaper !== originalProfile?.bgWallpaper ||
          draftProfile.bgImage !== originalProfile?.bgImage
        ) {
          updates.push(
            updateBackground({
              bgType: draftProfile.bgType,
              bgColor: draftProfile.bgColor,
              bgGradientFrom: draftProfile.bgGradientFrom,
              bgGradientTo: draftProfile.bgGradientTo,
              bgWallpaper: draftProfile.bgWallpaper,
              bgImage: draftProfile.bgImage,
            }),
          );
        }

        // Effects
        if (JSON.stringify(draftProfile.bgEffects) !== JSON.stringify(originalProfile?.bgEffects)) {
          updates.push(updateBackgroundEffects(draftProfile.bgEffects as any));
        }

        // Pattern
        if (JSON.stringify(draftProfile.bgPattern) !== JSON.stringify(originalProfile?.bgPattern)) {
          updates.push(updateBackgroundPattern(draftProfile.bgPattern as any));
        }

        // Card Texture
        if (draftProfile.cardTexture !== originalProfile?.cardTexture) {
          updates.push(updateCardTexture(draftProfile.cardTexture as any));
        }

        // Links Logic
        const originalLinks = originalProfile?.links || [];
        const draftLinks = draftProfile.links || [];

        // 1. Find deleted links
        const draftIds = new Set(draftLinks.map((l) => l.id));
        const deletedLinks = originalLinks.filter((l) => !draftIds.has(l.id));
        for (const link of deletedLinks) {
          updates.push(deleteLink(link.id));
        }

        // 2. Find updated or new links
        for (const draftLink of draftLinks) {
          if (String(draftLink.id).startsWith("temp-")) {
            const { id, ...linkData } = draftLink;
            updates.push(createLink(linkData as any));
          } else {
            const originalLink = originalLinks.find((l) => l.id === draftLink.id);
            if (originalLink && JSON.stringify(draftLink) !== JSON.stringify(originalLink)) {
              const { id, ...linkData } = draftLink;
              updates.push(updateLink(id, linkData as any));
            }
          }
        }

        // 3. Reordering
        const originalOrder = originalLinks.map((l) => l.id).join(",");
        const draftOrder = draftLinks.map((l) => l.id).join(",");
        if (originalOrder !== draftOrder && !draftLinks.some((l) => String(l.id).startsWith("temp-"))) {
          updates.push(reorderLinks(draftLinks.map((l) => l.id)));
        }

        // Socials Logic
        const originalSocials = originalProfile?.socials || [];
        const draftSocials = draftProfile.socials || [];

        // 1. Find deleted socials
        const draftSocialIds = new Set(draftSocials.map((s) => s.id));
        const deletedSocials = originalSocials.filter((s) => !draftSocialIds.has(s.id));
        for (const social of deletedSocials) {
          updates.push(deleteSocialLink(social.id));
        }

        // 2. Find updated or new socials
        for (const draftSocial of draftSocials) {
          if (String(draftSocial.id).startsWith("temp-")) {
            const { id, ...socialData } = draftSocial;
            updates.push(createSocialLink(socialData as any));
          } else {
            const originalSocial = originalSocials.find((s) => s.id === draftSocial.id);
            if (originalSocial && JSON.stringify(draftSocial) !== JSON.stringify(originalSocial)) {
              const { id, ...socialData } = draftSocial;
              updates.push(updateSocialLink(id, socialData as any));
            }
          }
        }

        const results = await Promise.all(updates);
        const hasError = results.some((r) => !r.success);

        if (hasError) {
          toast.error("Some changes failed to save", { id: toastId });
        } else {
          markAsSaved();
          toast.success("All changes saved", { id: toastId });
        }
      } catch (error) {
        toast.error("Failed to save changes", { id: toastId });
      }
    });
  };

  return (
    <header className=" backdrop-blur-md sticky top-0 z-50 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="font-bold text-xl tracking-tighter">
            oh<span className="text-primary text-2xl">!</span>
          </Link>
          <DomainView
            placeholder={fullUrl}
            value={fullUrl}
            buttonCopy={{
              idle: "Copy",
              success: "Copied!",
            }}
          />
        </div>

        {/* Center: Save Button */}
        <div className=" flex items-center gap-2">
          {isDirty && <span className="text-xs text-muted-foreground animate-pulse">Unsaved changes</span>}
          <Button onClick={handleSave} disabled={!isDirty || isPending} size="sm" variant={isDirty ? "default" : "outline"} className="gap-2">
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </header>
  );
}
