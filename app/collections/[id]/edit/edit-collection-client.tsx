"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CollectionForm } from "@/components/collection-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Collection {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon?: string | null;
  }>;
}

interface EditCollectionClientProps {
  initialCollection: Collection;
}

export function EditCollectionClient({ initialCollection }: EditCollectionClientProps) {
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
      const response = await fetch(`/api/collections/${initialCollection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push(`/collections/${initialCollection.id}`);
      } else {
        const { error } = await response.json();
        alert(error || "Failed to update collection");
      }
    } catch (error) {
      console.error("Failed to update collection:", error);
      alert("Failed to update collection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link href={`/collections/${initialCollection.id}`}>
          <Button variant="ghost" size="sm" className="mb-6">
            ← Back to Collection
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Collection</h1>
          <p className="text-muted-foreground mt-1">
            Update your collection details
          </p>
        </div>

        <CollectionForm
          onSubmit={handleSubmit}
          initialData={initialCollection}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

