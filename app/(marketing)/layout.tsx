import { LandingNav } from "@/components/landing/nav";


export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* <LandingNav /> */}
      {children}
    </div>
  );
}
