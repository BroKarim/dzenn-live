import { collectionService } from "@/lib/services/collection.service";
import { CollectionsClient } from "./collections-client";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || "1", 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { collections, total } = await collectionService.getAll({
    category: category || undefined,
    limit,
    offset,
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 selection:bg-primary selection:text-primary-foreground">
      <LandingNav />
      <main className="flex-1 font-mono text-sm">
        <CollectionsClient
          initialCollections={collections}
          total={total}
          currentPage={page}
          category={category}
        />
      </main>
      <LandingFooter />
    </div>
  );
}

