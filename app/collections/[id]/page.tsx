import { notFound } from "next/navigation";
import { collectionService } from "@/lib/services/collection.service";
import { getSession } from "@/lib/auth-guard";
import { CollectionViewClient } from "./collection-view-client";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const collection = await collectionService.getById(id, session?.user?.id);

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 selection:bg-primary selection:text-primary-foreground">
      <LandingNav />
      <main className="flex-1 font-mono text-sm">
        <CollectionViewClient initialCollection={collection} currentUserId={session?.user?.id} />
      </main>
      <LandingFooter />
    </div>
  );
}

