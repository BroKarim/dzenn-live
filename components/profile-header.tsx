"use client";

import type * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/share-dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface ProfileHeaderProps {
  name: string;
  username: string | null;
  avatarUrl: string | null;
}

/**
 * ProfileHeader component displays three action buttons on a profile page:
 * 1. Logo/Home button (top-left) - links to OneURL homepage
 * 2. Share button (top-right) - opens share dialog
 * 3. CTA button (bottom-center) - encourages new users to join OneURL
 */
export function ProfileHeader({
  name,
  username,
  avatarUrl,
}: ProfileHeaderProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  return (
    <>
      {/* Top buttons: Logo (left) and Share (right) */}
      <TooltipProvider>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          {/* Logo/Home Button */}
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background transition-colors pointer-events-auto"
                  aria-label="Go to OneURL homepage"
                >
                  <Image
                    src="/logo.png"
                    alt="OneURL"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                    priority
                  />
                </Link> as React.ReactElement
              }
            />
            <TooltipPopup>Go to OneURL homepage</TooltipPopup>
          </Tooltip>

          {/* Share Button */}
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={() => setShareDialogOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background transition-colors pointer-events-auto"
                  aria-label="Share profile"
                >
                  <Share2 className="h-5 w-5 text-foreground" />
                </button> as React.ReactElement
              }
            />
            <TooltipPopup>Share profile</TooltipPopup>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* CTA Button - positioned at bottom center */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10 pointer-events-none">
        <Link href="/signup" className="pointer-events-auto">
          <Button
            variant="outline"
            className="rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background whitespace-nowrap"
          >
            Join {username || "OneURL"} on OneURL
          </Button>
        </Link>
      </div>

      {/* Share Dialog */}
      {username && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          name={name}
          username={username}
          avatarUrl={avatarUrl}
        />
      )}
    </>
  );
}

