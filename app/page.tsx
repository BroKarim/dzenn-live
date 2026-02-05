import { Hero } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/nav";

export default async function HomePage() {
  return (
    <div className="relative">
      <LandingNav />
      <Hero />
    </div>
  );
}
