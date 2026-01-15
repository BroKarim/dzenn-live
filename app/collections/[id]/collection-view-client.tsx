"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CollectionVoteButtons } from "@/components/collection-vote-buttons";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAvatarUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

interface Collection {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  user: CollectionUser;
  links: CollectionLink[];
  upvotes: number;
  downvotes: number;
  score: number;
  userVote?: "UP" | "DOWN" | null;
}

interface CollectionViewClientProps {
  initialCollection: Collection;
  currentUserId?: string;
}

export function CollectionViewClient({
  initialCollection,
  currentUserId,
}: CollectionViewClientProps) {
  const router = useRouter();
  const [collection, setCollection] = useState(initialCollection);

  const avatarUrl = getAvatarUrl(collection.user);
  const isOwner = currentUserId === collection.user.id;

  const handleVote = async (collectionId: string, voteType: "UP" | "DOWN") => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/collections/${collectionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        const { collection: updatedCollection } = await response.json();
        setCollection(updatedCollection);
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this collection?")) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${collection.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/collections");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/collections">
          <Button variant="ghost" size="sm" className="mb-6">
            ← Back to Collections
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{collection.title}</CardTitle>
                  <Badge variant="outline">
                    {categoryLabels[collection.category] || collection.category}
                  </Badge>
                </div>
                {collection.description && (
                  <CardDescription className="text-base mt-2">
                    {collection.description}
                  </CardDescription>
                )}
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  {avatarUrl && (
                    <div className="size-6 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={avatarUrl}
                        alt={collection.user.name}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <span>
                    by{" "}
                    {collection.user.username ? (
                      <Link
                        href={`/${collection.user.username}`}
                        className="hover:underline"
                      >
                        @{collection.user.username}
                      </Link>
                    ) : (
                      collection.user.name
                    )}
                  </span>
                </div>
              </div>
              {currentUserId && (
                <CollectionVoteButtons
                  collectionId={collection.id}
                  score={collection.score}
                  userVote={collection.userVote}
                  onVote={handleVote}
                />
              )}
            </div>
            {isOwner && (
              <div className="mt-4 flex gap-2">
                <Link href={`/collections/${collection.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive-outline"
                  size="sm"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            )}
          </CardHeader>

          <CardPanel>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-4">
                Links ({collection.links.length})
              </h3>
              {collection.links.map((link) => {
                const displayImageUrl = link.previewImageUrl;
                const displayDescription = link.previewDescription;

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative rounded-xl border border-zinc-200 bg-white transition-all cursor-pointer shadow-xs hover:border-zinc-300 hover:bg-accent/50 dark:hover:bg-input/64 hover:shadow-zinc-200/24 active:shadow-none block p-3 group"
                  >
                    <div className="flex gap-3">
                      {displayImageUrl && (
                        <div className="w-1/3 shrink-0">
                          <div className="aspect-[4/3] bg-zinc-100 rounded-lg overflow-hidden relative">
                            <Image
                              src={displayImageUrl}
                              alt={link.title}
                              fill
                              className="object-cover select-none"
                              draggable={false}
                              unoptimized
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
                        <div className="size-10 shrink-0">
                          <Image
                            src={link.icon}
                            alt={link.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 p-4 space-y-1">
                        <h4 className="text-sm font-semibold text-zinc-900 truncate group-hover:text-zinc-700">
                          {link.title}
                        </h4>
                        <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                        {displayDescription && (
                          <p className="text-xs text-zinc-600 line-clamp-2 mt-1.5">
                            {displayDescription}
                          </p>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="absolute top-3 right-3 size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </CardPanel>
        </Card>
      </div>
    </div>
  );
}

