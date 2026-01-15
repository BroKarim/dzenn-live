"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CollectionForm } from "@/components/collection-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CreateCollectionClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    description?: string | null;
    category: string;
    links: Array<{ title: string; url: string; icon?: string | null }>;
  }) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { collection } = await response.json();
        router.push(`/collections/${collection.id}`);
      } else {
        const { error } = await response.json();
        alert(error || "Failed to create collection");
      }
    } catch (error) {
      console.error("Failed to create collection:", error);
      alert("Failed to create collection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link href="/collections">
          <Button variant="ghost" size="sm" className="mb-6">
            ← Back to Collections
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Collection</h1>
          <p className="text-muted-foreground mt-1">
            Share your favorite links with the community
          </p>
        </div>

        <CollectionForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

