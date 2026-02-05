"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Hero() {
  const [username, setUsername] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    if (!session) {
      // If not logged in, go to login (can pass username as query param if supported)
      router.push(`/login?username=${username}`);
    } else {
      // If logged in, go to editor/onboarding
      // Check if user has a username already
      router.push("/editor");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 ">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dctl5pihh/image/upload/v1768287477/background_valoru.jpg')",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-20 min-h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16 text-white">
        {/* Header Section */}
        <header className="flex md:mt-8 flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Title and Input - Top Left */}
          <div className="max-w-xl order-1">
            <h1 className="tracking-tight text-balance text-white drop-shadow-2xl font-serif font-thin lg:text-8xl md:text-8xl text-7xl">The Future of Agentic AI</h1>

            {/* Username Claim Form */}
            <div
              className="mt-8 backdrop-blur-md p-2 bg-white rounded-2xl max-w-md"
              style={{
                boxShadow:
                  "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px",
              }}
            >
              <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 bg-zinc-50/50 rounded-xl focus-within:ring-1 focus-within:ring-zinc-200 transition-all">
                  <span className="text-zinc-400 font-medium select-none text-sm sm:text-base whitespace-nowrap">dzenn.link</span>
                  <Input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                    required
                    className="flex-1 border-none text-zinc-900 placeholder:text-zinc-300 h-11 sm:h-12 px-1 bg-transparent rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-medium text-sm sm:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-11 sm:h-12 px-6 hover:bg-fuchsia-500 text-white font-medium transition-colors bg-black rounded-xl whitespace-nowrap"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Claim Page
                </Button>
              </form>
            </div>
          </div>

          {/* Description - Top Right */}
          <div className="max-w-sm md:text-right order-2">
            <p className="text-white/90 text-base leading-relaxed drop-shadow-lg md:text-base">
              Autonomous AI agents that think and act.
              <br />
              Revolutionary intelligence for the modern world.
              <br />
              Join the AI revolution today.
            </p>
          </div>
        </header>

        {/* Stats Section - Bottom */}
        <footer className="fixed bottom-0 left-0 right-0 z-30 p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-3 gap-4 md:gap-8 lg:gap-12">
            {/* Stat 1 */}
            <div className="text-center sm:text-left">
              <div className="md:text-7xl lg:text-8xl text-white drop-shadow-2xl text-center font-extralight text-4xl">1M+</div>
              <div className="mt-2 md:text-base text-white/70 tracking-widest uppercase text-center text-xs">AI Agents Deployed</div>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="md:text-7xl lg:text-8xl text-white drop-shadow-2xl font-extralight text-4xl">24/7</div>
              <div className="mt-2 md:text-base text-white/70 tracking-widest uppercase text-xs">Autonomous Operations</div>
            </div>

            {/* Stat 3 */}
            <div className="text-center sm:text-right">
              <div className="md:text-7xl lg:text-8xl text-white drop-shadow-2xl text-center font-extralight text-4xl">99.9%</div>
              <div className="mt-2 md:text-base text-white/70 tracking-widest uppercase text-center text-xs">Accuracy Rate</div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
