import { Support } from "@/components/landing/support";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 selection:bg-primary selection:text-primary-foreground">
      <LandingNav />
      <main className="flex-1 font-mono text-sm">
        <Support />
      </main>
      <LandingFooter />
    </div>
  );
}

