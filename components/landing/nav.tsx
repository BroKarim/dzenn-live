"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { ArrowRightIcon } from "lucide-react";

export function LandingNav() {
  const { data: session, isPending } = useSession();

  const navLinks = [
    { name: "Index", href: "/" },
    { name: "Info", href: "/info" },
  ];

  const shadowClass =
    "shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33]";

  return (
    <nav className="fixed top-4 left-4 md:left-16 z-50 flex items-center gap-3">
      {/* logo */}
      <Link href="/" className={cn("w-10 h-10 flex items-center justify-center rounded-full bg-[#222] border-none text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 shrink-0", shadowClass)}>
        Dz
      </Link>

      {/* nav links */}
      <div className={cn("flex items-center gap-1 p-1 rounded-full bg-[#222] border-none", shadowClass)}>
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href} className="px-4 py-1.5 rounded-full text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-200">
            {link.name}
          </Link>
        ))}
        {isPending ? (
          <div className="px-4 py-1.5 w-16 h-5 animate-pulse bg-zinc-800 rounded-full" />
        ) : session ? (
          <Link href="/dashboard" className="group px-4 py-1.5 rounded-full text-[13px] font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 flex items-center gap-1.5">
            Editor
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Link href="/login" className="px-4 py-1.5 rounded-full text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-200">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
