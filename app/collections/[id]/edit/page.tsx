import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { collectionService } from "@/lib/services/collection.service";
import { EditCollectionClient } from "./edit-collection-client";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const { id } = await params;

  const collection = await collectionService.getById(id, session.user.id);

  if (!collection) {
    notFound();
  }

  if (collection.user.id !== session.user.id) {
    redirect(`/collections/${id}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 selection:bg-primary selection:text-primary-foreground">
      <LandingNav />
      <main className="flex-1 font-mono text-sm">
        <EditCollectionClient initialCollection={collection} />
      </main>
      <LandingFooter />
    </div>
  );
}

