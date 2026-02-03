import { Hero } from "@/components/landing/hero-2";
import { LandingNav } from "@/components/landing/nav";

export default async function HomePage() {
  return (
    <div className="relative">
      <LandingNav />
      <Hero />
    </div>
  );
}
