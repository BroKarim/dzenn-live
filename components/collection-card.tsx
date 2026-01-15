"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/utils";
import { CollectionVoteButtons } from "./collection-vote-buttons";

const categoryLabels: Record<string, string> = {
  UI_LIBRARY: "UI Library",
  RESOURCES: "Resources",
  SITES: "Sites",
  TOOLS: "Tools",
  OTHER: "Other",
};

interface CollectionLink {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
  previewImageUrl?: string | null;
  previewDescription?: string | null;
}

interface CollectionUser {
  id: string;
  name: string;
  username: string | null;
  avatarUrl?: string | null;
  image?: string | null;
}

interface CollectionCardProps {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  user: CollectionUser;
  links: CollectionLink[];
  score: number;
  userVote?: "UP" | "DOWN" | null;
  currentUserId?: string;
  onVote?: (collectionId: string, voteType: "UP" | "DOWN") => void;
}

export function CollectionCard({
  id,
  title,
  description,
  category,
  user,
  links,
  score,
  userVote,
  currentUserId,
  onVote,
}: CollectionCardProps) {
  const avatarUrl = getAvatarUrl(user);
  const displayLinks = links.slice(0, 3);
  const remainingCount = links.length - displayLinks.length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-base">{title}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {categoryLabels[category] || category}
              </Badge>
            </div>
            {description && (
              <CardDescription className="text-sm line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
          {currentUserId && onVote && (
            <CollectionVoteButtons
              collectionId={id}
              score={score}
              userVote={userVote}
              onVote={onVote}
            />
          )}
        </div>
      </CardHeader>

      <CardPanel>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {avatarUrl && (
              <div className="size-5 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <Image
                  src={avatarUrl}
                  alt={user.name}
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span>
              by {user.username ? `@${user.username}` : user.name}
            </span>
          </div>

          <div className="space-y-2">
            {displayLinks.map((link) => {
              const displayImageUrl = link.previewImageUrl;
              const displayDescription = link.previewDescription;

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-lg border border-zinc-200 bg-white transition-all cursor-pointer shadow-xs hover:border-zinc-300 hover:bg-accent/50 dark:hover:bg-input/64 hover:shadow-zinc-200/24 active:shadow-none block p-2 group"
                >
                  <div className="flex gap-2 items-center">
                    {displayImageUrl && (
                      <div className="w-12 h-12 shrink-0">
                        <div className="w-full h-full bg-zinc-100 rounded overflow-hidden relative">
                          <Image
                            src={displayImageUrl}
                            alt={link.title}
                            fill
                            className="object-cover select-none"
                            draggable={false}
                            unoptimized
                            sizes="48px"
                            onError={(e) => {
                              console.error("Failed to load image:", displayImageUrl);
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {!displayImageUrl && link.icon && (
                      <div className="size-5 shrink-0">
                        <Image
                          src={link.icon}
                          alt={link.title}
                          width={20}
                          height={20}
                          className="w-full h-full object-cover rounded"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block truncate">
                        {link.title}
                      </span>
                      {displayDescription && (
                        <span className="text-xs text-muted-foreground line-clamp-1 block">
                          {displayDescription}
                        </span>
                      )}
                    </div>
                    <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </a>
              );
            })}
            {remainingCount > 0 && (
              <div className="text-xs text-muted-foreground text-center py-1">
                +{remainingCount} more link{remainingCount !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <Link href={`/collections/${id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Collection
            </Button>
          </Link>
        </div>
      </CardPanel>
    </Card>
  );
}

