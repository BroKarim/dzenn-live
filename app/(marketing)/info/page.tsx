import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Info · The Dzenn Philosophy",
  description: "Learn about the mindset behind Dzenn—why digital identity became stale and how we're redefining the 'link-in-bio' for modern creators.",
};

export default function InfoPage() {
  return (
    <main className="flex flex-col bg-white min-h-screen items-center justify-center px-8 py-24">
      <div className="max-w-3xl w-full">
        {/* Main Title */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl md:text-8xl font-serif font-thin text-black tracking-tighter">
            <span className="italic">Dzenn</span>
          </h1>
          <p className="mt-4 text-zinc-400 uppercase tracking-[0.3em] text-[10px] font-bold">Not your ordinary linktree</p>
        </div>

        {/* The Philosophy Section */}
        <section className="mb-16 text-center">
          {/* <h2 className="text-zinc-800 text-[10px] uppercase tracking-[0.2em] font-black mb-6">The Philosophy</h2> */}
          <p className="text-zinc-600 leading-relaxed text-base md:text-lg font-light">
            Dzenn was born from a simple realization: digital identity has become stale. Inspired by the nonchalant aesthetic of modern web design, we built a platform for creators who demand more than just a list of buttons. We believe
            your "link-in-bio" should be a reflection of your vibe—premium, interactive, and undeniably you.
          </p>
        </section>

        {/* Design Excellence Section */}
        <section className="mb-16 text-center">
          <h2 className="text-zinc-800 text-[10px] uppercase tracking-[0.2em] font-black mb-6">Visual Excellence</h2>
          <p className="text-zinc-600 leading-relaxed text-base md:text-lg font-light">
            We prioritize quality over quantity. From our signature <span className="text-black font-medium">Glassy Textures</span> to dynamic background patterns like Waves and Noise, every element of Dzenn is engineered to hit different.
            We provide the tools—you provide the vibes.
          </p>
          <div className="mt-8 flex w-full justify-center gap-6">
            <Link href="https://github.com/BroKarim/dzenn-live" className="text-black hover:text-zinc-600 text-xs font-medium transition-colors underline underline-offset-4">
              GitHub
            </Link>
            <Link href="https://x.com/BroKariim" className="text-black hover:text-zinc-600 text-xs font-medium transition-colors underline underline-offset-4">
              X / Twitter
            </Link>
            <Link href="https://www.threads.com/@brokariim" className="text-black hover:text-zinc-600 text-xs font-medium transition-colors underline underline-offset-4">
              Threads
            </Link>
          </div>
        </section>

        {/* Footer Link */}
        <div className="mt-32 text-center">
          <Link href="/" className="text-zinc-400 hover:text-black text-xs transition-all duration-300 group inline-flex items-center gap-2">
            ← Back to safe space
          </Link>
        </div>
      </div>
    </main>
  );
}
