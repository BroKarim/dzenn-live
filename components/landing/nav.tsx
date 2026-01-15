import Link from "next/link";
import Image from "next/image";
import { GitHubStars } from "@/components/github-stars";
import { Button } from "../ui/button";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-100/80 backdrop-blur-xl supports-backdrop-filter:bg-zinc-100/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
           <Image 
             src="/logo.png" 
             alt="OneURL Logo" 
             width={128} 
             height={128} 
             className="w-20 h-20"
           />
        </Link>
        <div className="flex items-center gap-4">
          <Button 
            render={<Link href="/profiles" className="hover:text-foreground transition-colors">Profiles</Link>} 
            variant="ghost"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Profiles
          </Button>
          <Button 
            render={<Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link>} 
            variant="ghost"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Collections
          </Button>
          <Button 
            render={<Link href="/support" className="hover:text-foreground transition-colors">Sponsor OneURL</Link>} 
            variant="ghost"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Sponsor OneURL
          </Button>
          <Button 
            render={<Link href="/login" />} 
            className="text-sm font-medium bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 hover:border-zinc-800 transition-colors"
          >
            Log in
          </Button>
          <GitHubStars repo="KartikLabhshetwar/oneurl" /> 
        </div>
      </div>
    </nav>
  );
}

