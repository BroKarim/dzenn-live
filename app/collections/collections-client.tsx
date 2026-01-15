"use client";

import { useState, useEffect } from "react";
import { CollectionCard } from "@/components/collection-card";
import { Button } from "@/components/ui/button";
import { Select, SelectPopup as SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Collection {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  user: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl?: string | null;
    image?: string | null;
  };
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon?: string | null;
  }>;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote?: "UP" | "DOWN" | null;
}

interface CollectionsClientProps {
  initialCollections: Collection[];
  total: number;
  currentPage: number;
  category?: string;
}

export function CollectionsClient({
  initialCollections,
  total,
  currentPage,
  category: initialCategory,
}: CollectionsClientProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [collections, setCollections] = useState(initialCollections);
  const [category, setCategory] = useState(initialCategory || "ALL");
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCollections(initialCollections);
    setCategory(initialCategory || "ALL");
  }, [initialCollections, initialCategory]);

  const handleVote = async (collectionId: string, voteType: "UP" | "DOWN") => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setIsVoting((prev) => ({ ...prev, [collectionId]: true }));

    try {
      const response = await fetch(`/api/collections/${collectionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        const { collection } = await response.json();
        setCollections((prev) =>
          prev.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  score: collection.score,
                  upvotes: collection.upvotes,
                  downvotes: collection.downvotes,
                  userVote: collection.userVote,
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsVoting((prev) => ({ ...prev, [collectionId]: false }));
    }
  };

  const handleCategoryChange = (newCategory: string | null) => {
    if (!newCategory) return;
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === "ALL") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }
    params.delete("page");
    router.push(`/collections?${params.toString()}`);
    router.refresh();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Link Collections</h1>
            <p className="text-muted-foreground mt-1">
              Discover curated collections of links shared by the community
            </p>
          </div>
          {session?.user && (
            <Link href="/collections/new">
              <Button>Create Collection</Button>
            </Link>
          )}
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="UI_LIBRARY">UI Library</SelectItem>
              <SelectItem value="RESOURCES">Resources</SelectItem>
              <SelectItem value="SITES">Sites</SelectItem>
              <SelectItem value="TOOLS">Tools</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            {total} collection{total !== 1 ? "s" : ""}
          </div>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No collections found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  {...collection}
                  currentUserId={session?.user?.id}
                  onVote={handleVote}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(currentPage - 1));
                    router.push(`/collections?${params.toString()}`);
                  }}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(currentPage + 1));
                    router.push(`/collections?${params.toString()}`);
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

