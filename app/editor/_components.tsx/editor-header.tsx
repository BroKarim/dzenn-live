"use client";

import { Save, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DomainView } from "@/components/domain-view";
import { ModeSwitcher } from "@/components/mode-switcher";
import { ProfileEditorData } from "@/server/user/profile/payloads";
import { useEditorStore } from "@/lib/stores/editor-store";
import { useState, useTransition } from "react";
import { updateProfile, updateBackground, updateBackgroundEffects, updateBackgroundPattern, updateCardTexture } from "@/server/user/profile/actions";
import { toast } from "sonner";

interface EditorHeaderProps {
  profile: ProfileEditorData;
}

export default function EditorHeader({ profile }: EditorHeaderProps) {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "ohmylink.com").replace(/https?:\/\//, "");
  const username = (profile as any).user?.username || profile.slug || "user";
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
        if (draftProfile.displayName !== originalProfile?.displayName || draftProfile.bio !== originalProfile?.bio || draftProfile.avatarUrl !== originalProfile?.avatarUrl) {
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
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {isDirty && <span className="text-xs text-muted-foreground animate-pulse">Unsaved changes</span>}
          <Button onClick={handleSave} disabled={!isDirty || isPending} size="sm" variant={isDirty ? "default" : "outline"} className="gap-2">
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ModeSwitcher />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
