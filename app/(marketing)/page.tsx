// https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/app/(home)/page.tsx

import { cn } from "@/lib/utils";
import Link from "next/link";
import { cva } from "class-variance-authority";

import { Hero, AgnosticBackground, CreateAppAnimation, Writing } from "@/app/(marketing)/page.client";
// import ShadcnImage from "./shadcn.png";
// import ContributorCounter from "@/components/contributor-count";
// import { owner, repo } from "@/lib/github";
// import StoryImage from "./story.png";
// import CLIImage from "./cli.png";
// import Bg2Image from "./bg-2.png";
// import { story } from "@/content/docs/(framework)/integrations/story";

const headingVariants = cva("font-medium tracking-tight", {
  variants: {
    variant: {
      h2: "text-3xl lg:text-4xl",
      h3: "text-xl lg:text-2xl",
    },
  },
});

const buttonVariants = cva("inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors", {
  variants: {
    variant: {
      primary: "bg-brand text-brand-foreground hover:bg-brand-200",
      secondary: "border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const cardVariants = cva("rounded-2xl text-sm p-6 bg-origin-border shadow-lg", {
  variants: {
    variant: {
      secondary: "bg-brand-secondary text-brand-secondary-foreground",
      default: "border bg-fd-card",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export default function Page() {
  return (
    <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
      <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-origin-border">
        <Hero />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <p className="mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">the React.js docs framework you love.</p>
          <h1 className="text-4xl my-8 leading-tighter font-medium xl:text-5xl xl:mb-12">
            Build excellent
            <br className="md:hidden" /> documentations,
            <br />
            your <span className="text-brand">style</span>.
          </h1>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), "max-sm:text-sm")}>
              Getting Started
            </Link>
            <a href="https://codesandbox.io/p/sandbox/github/fuma-nama/fumadocs-ui-template" target="_blank" rel="noreferrer noopener" className={cn(buttonVariants({ variant: "secondary" }), "max-sm:text-sm")}>
              Open CodeSandbox
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2 lg:mt-20">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Fumadocs is a <span className="text-brand font-medium">React.js</span> documentation framework for <span className="text-brand font-medium">Developers</span>, beautifully designed by{" "}
          <span className="text-brand font-medium">Fuma Nama</span>. Bringing powerful features for your docs workflows, with high customizability to fit your preferences, works seamlessly with any React.js framework, CMS — anything.
        </p>
        {/* <div className="relative p-4 rounded-2xl col-span-full z-2 overflow-hidden md:p-8">
          <Image src={CLIImage} alt="" className="absolute inset-0 size-full object-top object-cover -z-1" />
          <div className="mx-auto w-full max-w-[800px] p-2 bg-fd-card text-fd-card-foreground border rounded-2xl shadow-lg">
            <div className="relative bg-fd-secondary rounded-xl mt-2 border shadow-md">
              <div className="flex flex-row items-center gap-2 border-b p-2 text-fd-muted-foreground">
                <TerminalIcon className="size-4" />
                <span className="text-xs font-medium">Terminal</span>
                <div className="ms-auto me-2 size-2 rounded-full bg-red-400" />
              </div>

              <CreateAppAnimation className="p-2 text-fd-secondary-foreground/80" />
            </div>
          </div>
        </div>
        <Aesthetics />

        <Feedback />

        <ForEngineers />
        <OpenSource /> */}
      </div>
    </main>
  );
}

// function Story() {
//   return (
//     <div className="relative col-span-full min-h-[570px] px-2 py-6 rounded-2xl z-2 border shadow-md">
//       <Image src={StoryImage} alt="" className="absolute inset-0 size-full -z-1 pointer-events-none object-cover object-top rounded-2xl" />

//       <div className="w-full m-auto max-w-[500px] text-start shadow-xl p-2 bg-fd-card/80 backdrop-blur-md rounded-xl border shadow-black/50 dark:bg-fd-card/50">
//         <div className="pt-3 px-3">
//           <h2
//             className={cn(
//               headingVariants({
//                 className: "mb-4",
//                 variant: "h3",
//               }),
//             )}
//           >
//             Fumadocs Story
//           </h2>
//           <p className="text-sm mb-4">Built for UI component libraries – bring an interactive playground to showcase your components vividly.</p>
//           <Link href="/docs/integrations/story" className={cn(buttonVariants({ variant: "primary", className: "text-sm py-2 mb-4" }))}>
//             Explore
//           </Link>
//         </div>
//         <story.WithControl />
//       </div>
//     </div>
//   );
// }

// function Aesthetics() {
//   return (
//     <>
//       <div
//         className={cn(
//           cardVariants({
//             variant: "secondary",
//             className: "flex items-center justify-center p-0",
//           }),
//         )}
//       >
//         <PreviewImages />
//       </div>
//       <div className={cn(cardVariants(), "flex flex-col")}>
//         <h3 className={cn(headingVariants({ variant: "h3", className: "mb-6" }))}>Minimal aesthetics, Maximum customizability.</h3>
//         <p className="mb-4">Fumadocs offer well-designed themes, with a headless mode to plug your own UI.</p>
//         <p className="mb-4">Pro designer? Customize the theme using Fumadocs CLI.</p>
//       </div>
//     </>
//   );
// }

// const feedback = [
//   {
//     avatar: "https://avatars.githubusercontent.com/u/124599",
//     user: "shadcn",
//     role: "Creator of Shadcn UI",
//     message: `You know how you end up rebuilding a full docs site every time you start a new project?

// Fumadocs fixes this by giving you all the right blocks that you compose together.

// Like headless docs to build exactly what you need.`,
//   },
//   {
//     avatar: "https://avatars.githubusercontent.com/u/35677084",
//     user: "Anthony Shew",
//     role: "Turbo DX at Vercel",
//     message: `Major shoutout to @fuma_nama for making fumadocs, a gorgeous documentation framework that composes beautifully into the App Router.`,
//   },
//   {
//     user: "Aiden Bai",
//     avatar: "https://avatars.githubusercontent.com/u/38025074",
//     role: "Creator of Million.js",
//     message: "fumadocs is the best Next.js docs framework",
//   },
//   {
//     avatar: "https://avatars.githubusercontent.com/u/10645823",
//     user: "David Blass",
//     role: "Creator of Arktype",
//     message: `I'd have no shot building @arktypeio docs that looked half this good without it 😍`,
//   },
// ];

// function Feedback() {
//   return (
//     <>
//       <div className={cn(cardVariants())}>
//         <h3 className={cn(headingVariants({ variant: "h3", className: "mb-6" }))}>A framework people love.</h3>
//         <p className="mb-6">Loved by teams and developers from startups like Unkey, Vercel, Orama — evolving everyday to be your favourite docs framework.</p>
//         <Link href="/showcase" className={cn(buttonVariants())}>
//           Showcase
//         </Link>
//       </div>
//       <div
//         className={cn(
//           cardVariants({
//             variant: "secondary",
//             className: "relative p-0",
//           }),
//         )}
//       >
//         <div className="absolute inset-0 z-2 inset-shadow-[0_10px_60px] inset-shadow-brand-secondary rounded-2xl" />
//         <Marquee className="p-8">
//           {feedback.map((item) => (
//             <div key={item.user} className="flex flex-col rounded-xl border bg-fd-card text-landing-foreground p-4 shadow-lg w-[320px]">
//               <p className="text-sm whitespace-pre-wrap">{item.message}</p>

//               <div className="mt-auto flex flex-row items-center gap-2 pt-4">
//                 <Image src={item.avatar} alt="avatar" width="32" height="32" unoptimized className="size-8 rounded-full" />
//                 <div>
//                   <p className="text-sm font-medium">{item.user}</p>
//                   <p className="text-xs text-fd-muted-foreground">{item.role}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Marquee>
//       </div>
//     </>
//   );
// }

// function ForEngineers() {
//   return (
//     <>
//       <h2
//         className={cn(
//           headingVariants({
//             variant: "h2",
//             className: "text-brand text-center mb-4 col-span-full",
//           }),
//         )}
//       >
//         Docs For Engineers.
//       </h2>
//       <Story />

//       <div
//         className={cn(
//           cardVariants({
//             className: "flex flex-col",
//           }),
//         )}
//       >
//         <h3 className={cn(headingVariants({ variant: "h3", className: "mb-6" }))}>A truly composable framework.</h3>
//         <p className="mb-8">
//           Separated as <span className="text-brand">Content</span> → <span className="text-brand">Core</span> → <span className="text-brand">UI</span>, offering the high composability that engineers love — you can use Fumadocs as a library,
//           without adapting the entire framework.
//         </p>
//         <div className="mt-auto flex flex-col gap-2 @container mask-[linear-gradient(to_bottom,white,transparent)]">
//           {[
//             {
//               name: "fumadocs-mdx",
//               description: "Use MDX in your React framework elegantly.",
//             },
//             {
//               name: "fumadocs-core",
//               description: "Headless library for building docs + handling content.",
//             },
//             {
//               name: "fumadocs-ui",
//               description: "UI library for building docs.",
//             },
//             {
//               name: "fumadocs-openapi",
//               description: "Extend Fumadocs to render OpenAPI docs.",
//             },
//             {
//               name: "fumadocs-obsidian",
//               description: "Extend Fumadocs to handle Obsidian-style Markdown.",
//             },
//           ].map((item) => (
//             <div key={item.name} className="flex flex-col text-sm gap-2 p-2 border border-dashed border-brand-secondary @lg:flex-row @lg:items-center last:@max-lg:hidden">
//               <p className="font-medium text-nowrap">{item.name}</p>
//               <p className="text-xs flex-1 @lg:text-end">{item.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className={cn(cardVariants())}>
//         <h3 className={cn(headingVariants({ variant: "h3", className: "mb-6" }))}>Adopts your content.</h3>
//         <p className="mb-4">
//           Designed to integrate with any <span className="text-brand">content source</span>, Fumadocs works on MDX, Content Collections, and even your own CMS.
//         </p>
//         <div className="flex flex-row w-fit items-center gap-4 mb-6">
//           {[
//             {
//               href: "https://github.com/fuma-nama/fumadocs-basehub",
//               text: "BaseHub CMS",
//             },
//             {
//               href: "https://github.com/fuma-nama/fumadocs-sanity",
//               text: "Sanity",
//             },
//             {
//               href: "https://github.com/MFarabi619/fumadocs-payloadcms",
//               text: "Payload CMS",
//             },
//           ].map((item) => (
//             <a key={item.href} href={item.href} rel="noreferrer noopener" target="_blank" className="text-sm text-brand hover:underline">
//               {item.text}
//             </a>
//           ))}
//         </div>
//       </div>
//       <div className={cn(cardVariants({ className: "relative overflow-hidden min-h-[400px] z-2" }))}>
//         <Image src={Bg2Image} alt="" className="absolute inset-0 size-full object-cover object-top -z-1" />
//         <div className="absolute top-8 left-4 w-[70%] flex flex-col bg-neutral-50/80 backdrop-blur-lg border text-neutral-800 p-2 rounded-xl shadow-lg shadow-black dark:bg-neutral-900/80 dark:text-neutral-200">
//           <p className="px-2 pb-2 font-medium border-b mb-2 text-neutral-500 dark:text-neutral-400">My CMS</p>
//           {["My Page", "Another Page", "Components", "Getting Started"].map((page) => (
//             <div key={page} className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-400/20">
//               <FileIcon className="stroke-neutral-500 size-4 dark:stroke-neutral-400" />
//               <span className="text-sm">{page}</span>
//               <div className="px-3 py-1 font-mono rounded-full bg-brand text-xs text-brand-foreground ms-auto">Article</div>
//             </div>
//           ))}
//         </div>

//         <div className="absolute bottom-8 right-4 w-[70%] flex flex-col bg-neutral-100 text-neutral-800 rounded-xl border shadow-lg shadow-black dark:bg-neutral-900 dark:text-neutral-200">
//           <div className="px-4 py-2 text-neutral-500 border-b font-medium dark:text-neutral-400">MDX Editor</div>
//           <pre className="text-base text-neutral-800 overflow-auto p-4 dark:text-neutral-400">
//             {`---
// title: Hello World
// ---

// # Hello World!

// This is my first document.`}
//           </pre>
//         </div>
//       </div>
//       <div className={cn(cardVariants(), "flex flex-col max-md:pb-0")}>
//         <h3 className={cn(headingVariants({ variant: "h3", className: "mb-6" }))}>Enhance your search experience.</h3>
//         <p className="mb-6">Integrate with Orama Search and Algolia Search in your docs easily.</p>
//         <Link href="/docs/headless/search/algolia" className={cn(buttonVariants({ className: "w-fit mb-8" }))}>
//           Learn More
//         </Link>
//         <Search />
//       </div>
//       <div className={cn(cardVariants(), "flex flex-col p-0 overflow-hidden")}>
//         <div className="p-6 mb-2">
//           <h3 className={cn(headingVariants({ variant: "h3", className: "mb-6" }))}>The shadcn/ui for docs</h3>
//           <p className="mb-6">Fumadocs CLI creates interactive components for your docs, offering a rich experience to your users.</p>
//           <Link href="/docs/cli" className={cn(buttonVariants({ className: "w-fit" }))}>
//             Commands
//           </Link>
//         </div>
//         <Image src={ShadcnImage} alt="shadcn" className="mt-auto flex-1 w-full object-cover" />
//       </div>
//     </>
//   );
// }

// const searchItemVariants = cva("rounded-md p-2 text-sm text-fd-popover-foreground");

// function Search() {
//   return (
//     <div className="flex select-none flex-col mt-auto bg-fd-popover rounded-xl border mask-[linear-gradient(to_bottom,white_40%,transparent_90%)] max-md:-mx-4">
//       <div className="inline-flex items-center gap-2 px-4 py-3 text-sm text-fd-muted-foreground">
//         <SearchIcon className="size-4" />
//         Search...
//       </div>
//       <div className="border-t p-2">
//         {[
//           ["Getting Started", "Use Fumadocs in your project."],
//           ["Components", "The UI Components for your docs."],
//           ["MDX Content", "Using MDX for content."],
//           ["User Guide", "How to use Fumadocs."],
//         ].map(([title, description], i) => (
//           <div key={i} className={cn(searchItemVariants(), i === 0 && "bg-fd-accent")}>
//             <div className="flex flex-row items-center gap-2">
//               <FileTextIcon className="size-4 text-fd-muted-foreground" />
//               <p>{title}</p>
//               {i === 7 && <p className="ms-auto text-xs text-fd-muted-foreground">Open</p>}
//             </div>
//             <p className="text-xs mt-2 text-fd-muted-foreground ps-6">{description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function OpenSource() {
//   return (
//     <>
//       <h2
//         className={cn(
//           headingVariants({
//             variant: "h2",
//             className: "mt-8 text-brand text-center mb-4 col-span-full",
//           }),
//         )}
//       >
//         A Framework of Dream.
//       </h2>

//       <div className={cn(cardVariants({ className: "flex flex-col" }))}>
//         <Heart fill="currentColor" className="text-pink-500 mb-4" />
//         <h3
//           className={cn(
//             headingVariants({
//               variant: "h3",
//               className: "mb-6",
//             }),
//           )}
//         >
//           Made Possible by You.
//         </h3>
//         <p className="mb-8">Fumadocs is 100% powered by passion and open source community.</p>
//         <div className="mb-8 flex flex-row items-center gap-2">
//           <Link href="/sponsors" className={cn(buttonVariants({ variant: "primary" }))}>
//             Sponsors
//           </Link>
//           <a href="https://github.com/fuma-nama/fumadocs/graphs/contributors" rel="noreferrer noopener" className={cn(buttonVariants({ variant: "secondary" }))}>
//             Contributors
//           </a>
//         </div>
//         <ContributorCounter repoOwner={owner} repoName={repo} />
//       </div>
//       <div
//         className={cn(
//           cardVariants({
//             className: "flex flex-col p-0 pt-8",
//           }),
//         )}
//       >
//         <h2 className="text-3xl text-center font-extrabold font-mono uppercase mb-4 lg:text-4xl">Build Your Docs</h2>
//         <p className="text-center font-mono text-xs opacity-50 mb-8">light and gorgeous, just like the moon.</p>
//         <div className="h-[200px] mt-auto overflow-hidden p-8 bg-gradient-to-b from-brand-secondary/10">
//           <div className="mx-auto bg-radial-[circle_at_0%_100%] from-60% from-transparent to-brand-secondary size-[500px] rounded-full" />
//         </div>
//       </div>

//       <ul
//         className={cn(
//           cardVariants({
//             className: "flex flex-col gap-6 col-span-full",
//           }),
//         )}
//       >
//         <li>
//           <span className="flex flex-row items-center gap-2 font-medium">
//             <BatteryChargingIcon className="size-5" />
//             Battery guaranteed.
//           </span>
//           <span className="mt-2 text-sm text-fd-muted-foreground">Actively maintained, open for contributions.</span>
//         </li>
//         <li>
//           <span className="flex flex-row items-center gap-2 font-medium">
//             <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
//               <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
//             </svg>
//             Fully open-source.
//           </span>
//           <span className="mt-2 text-sm text-fd-muted-foreground">Open source, available on Github.</span>
//         </li>
//         <li>
//           <span className="flex flex-row items-center gap-2 font-medium">
//             <TimerIcon className="size-5" />
//             Within seconds.
//           </span>
//           <span className="mt-2 text-sm text-fd-muted-foreground">Initialize a new project instantly with CLI.</span>
//         </li>
//         <li className="flex flex-row flex-wrap gap-2 mt-auto">
//           <Link href="/docs" className={cn(buttonVariants())}>
//             Read docs
//           </Link>
//           <a
//             href="https://github.com/fuma-nama/fumadocs"
//             rel="noreferrer noopener"
//             className={cn(
//               buttonVariants({
//                 variant: "secondary",
//               }),
//             )}
//           >
//             Open GitHub
//           </a>
//         </li>
//       </ul>
//     </>
//   );
// }
