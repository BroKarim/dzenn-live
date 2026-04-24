//https://resurf.so/
"use client";

import type { SVGProps } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BACKGROUND_STYLE = {
  backgroundImage: "url('https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
} as const;

const NAV_LINK_CLASSNAME = "text-sm font-medium text-foreground/70 hover:text-foreground/70 transition-colors";

const APPLE_BUTTON_BASE_CLASSNAME = "bg-blue-500 hover:bg-blue-600 text-white rounded-full gap-1.5 text-sm font-medium shadow-md";

const APPLE_ICON_PATH =
  "M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.1 268.5-317.1 71 0 130.1 46.7 175.1 46.7 43.1 0 110.8-49.3 192.6-49.3zm-1-192.3c33 0 66 28.5 94.3 56-34.1 38.7-112.1 66.2-143.6 66.2C707.4 270.8 661.5 241.6 661.5 213c0-28.6 30.7-64.4 125.6-64.4z";

const HIGHLIGHT_FEATURES = [
  {
    title: "Capture instantly.",
    desc: "Notes, links, images, voice — grab anything in seconds with a keyboard shortcut.",
  },
  {
    title: "Your data, your Mac.",
    desc: "Everything stays local. Nothing is uploaded or shared unless you choose to.",
  },
  {
    title: "Resurface when it matters.",
    desc: "A visual library that makes it easy to find and rediscover what you've saved.",
  },
] as const;

function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 814 1000" className="w-3.5 h-3.5 fill-current" {...props}>
      <path d={APPLE_ICON_PATH} />
    </svg>
  );
}

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10" style={BACKGROUND_STYLE} />

      {/* Scrollable content */}
      <section>
        <div className="pt-10 sm:pt-16">
          <div className="bg-primary/10 border-primary/30 backdrop-blur-2xl rounded-2xl relative z-10 mx-auto max-w-4xl flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="flex items-center justify-between border-0.5 border-b border-primary/10 px-4 sm:px-8 py-2">
              <nav className="flex items-center gap-6">
                <a href="#" className={NAV_LINK_CLASSNAME}>
                  Why
                </a>
                <a href="#" className={NAV_LINK_CLASSNAME}>
                  Updates
                </a>
              </nav>

              {/* Center logo */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <Button size="sm" className={`${APPLE_BUTTON_BASE_CLASSNAME} px-4`}>
                <AppleIcon aria-hidden="true" focusable="false" />
                Download for Mac
              </Button>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center">
              <section className="flex flex-col items-center text-center pt-16 pb-8 px-4">
                {/* Beta badge */}
                <Badge className="mb-2 bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 px-4 py-1 text-sm font-medium rounded-full">Currently in Beta</Badge>

                {/* Headline */}
                <h1
                  className="text-4xl sm:text-6xl md:text-5xl font-serif font-normal text-gray-900 leading-tight mb-2 max-w-2xl"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Open Source
                  <br />
                  Link in bio
                </h1>

                {/* Subheadline */}
                <p className="text-foreground/70 text-base md:text-lg max-w-sm mb-10 leading-relaxed">
                  A local-first personal library for thoughts,
                  <br />
                  links, and everything worth keeping.
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3 mb-4">
                  <Button className={`${APPLE_BUTTON_BASE_CLASSNAME} px-6 py-2.5 gap-2`}>
                    <AppleIcon aria-hidden="true" focusable="false" />
                    Try for free
                  </Button>
                </div>

                <p className="text-sm text-foreground/70">Free to try · iPhone app coming soon</p>
              </section>

              {/* App Preview Window */}
              <section className="w-full max-w-4xl mx-auto pb-10">
                <div className="flex z-80 px-4 sm:px-8 pb-8 pt-[2px] max-h-[450px] overflow-hidden flex-col gap-2 animate-fade-in">
                  <div className="w-full rounded-xl shrink-0 ring-1 ring-foreground/10 border-foreground/10 shadow-popover translate-x-[-1px] h-fit flex flex-col items-center justify-center relative overflow-hidden">
                    <img src="https://resurf.so/capture-hero.png" alt="CaptureAI" className="w-full h-full object-cover transition-opacity duration-300" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 border-0.5 border-y border-primary/50">
                  {HIGHLIGHT_FEATURES.map((feature, i) => (
                    <div key={feature.title} className={`p-4 sm:p-6 ${i < 2 ? "md:border-r border-0.5 border-primary/50" : ""}`}>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="w-full mx-auto">
                <div className="grid grid-cols-1">
                  <div style={{ animationDelay: "0.1s" }} className="flex flex-col gap-6 px-4 sm:px-6 border-0.5 border-primary/50 border-b md:px-10 py-10 animate-blur-fade-slide-in">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-foreground/70 tracking-wide">Capture</span>
                      <h3 className="text-2xl font-medium tracking-tight md:text-2xl text-foreground">Press a shortcut. Capture anything.</h3>
                      <div className="w-full relative ring bg-foreground/5 ring-foreground/10 ring-inset rounded-md overflow-hidden transition-opacity duration-500 opacity-100">
                        <video src="https://zyqdiwxgffuy8ymd.public.blob.vercel-storage.com/demos/capture-demo.mp4" className="w-full h-auto object-cover"></video>

                        <div className="absolute inset-0 rounded-md border border-foreground/20 z-10"></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ animationDelay: "0.1s" }} className="flex flex-col gap-6 px-4 sm:px-6 border-0.5 border-primary/50 border-b md:px-10 py-10 animate-blur-fade-slide-in">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-foreground/30 tracking-wide">Capture</span>
                      <h3 className="text-2xl font-medium tracking-tight md:text-2xl text-foreground">Press a shortcut. Capture anything.</h3>
                      <div className="w-full relative ring bg-foreground/5 ring-foreground/10 ring-inset rounded-md overflow-hidden transition-opacity duration-500 opacity-100">
                        <video src="https://zyqdiwxgffuy8ymd.public.blob.vercel-storage.com/demos/capture-demo.mp4" className="w-full h-auto object-cover"></video>

                        <div className="absolute inset-0 rounded-md border border-foreground/20 z-10"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center">
                  <div className="flex items-center space-x-3 mb-6">
                    <img alt="" className="h-11" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiLogoSquareShapeDark.svg" />
                  </div>
                  <p className="text-center max-w-xl text-sm font-normal leading-relaxed">Empowering creators worldwide with the most advanced AI content creation tools. Transform your ideas into reality.</p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
