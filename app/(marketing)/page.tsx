import type { Metadata } from "next";
import MarketingPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Dzenn - Not your ordinary linktree",
  description: "Replace your boring static website with a stunning, interactive link-in-bio that actually converts. Built for creators who demand excellence.",
};

export default function MarketingPage() {
  return <MarketingPageClient />;
}
