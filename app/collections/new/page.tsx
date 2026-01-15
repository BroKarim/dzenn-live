import { requireAuth } from "@/lib/auth-guard";
import { CreateCollectionClient } from "./create-collection-client";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export default async function NewCollectionPage() {
  const session = await requireAuth();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 selection:bg-primary selection:text-primary-foreground">
      <LandingNav />
      <main className="flex-1 font-mono text-sm">
        <CreateCollectionClient />
      </main>
      <LandingFooter />
    </div>
  );
}

