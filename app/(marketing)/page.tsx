import { Hero } from "@/components/landing/hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dzenn · Nonchalant Link in Bio for Creators",
  description: "Create a stunning, interactive link-in-bio that actually converts. Built for creators who demand excellence and design freedom.",
};

export default async function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}
