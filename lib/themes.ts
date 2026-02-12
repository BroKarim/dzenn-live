import { buildFontCssUrl } from "@/lib/fonts";

export type ProfileTheme = {
  id: string;
  name: string;
  type: "light" | "dark";
  variables: Record<string, string>;
  fontUrl?: string;
  icon?: string;
};

export const THEMES: Record<string, ProfileTheme> = {
  default: {
    id: "default",
    name: "Default",
    type: "dark",
    variables: {
      "--foreground": "oklch(0.985 0 0)",
      "--bio-foreground": "oklch(0.8 0 0)",
      "--accent": "oklch(0.985 0 0)",
      "--primary": "oklch(0.985 0 0)",
      "--font-sans": "Inter, sans-serif",
    },
  },
  amber: {
    id: "amber",
    name: "Amber",
    type: "light",
    fontUrl: buildFontCssUrl("Inter"),
    variables: {
      "--foreground": "oklch(0.2686 0 0)",
      "--bio-foreground": "oklch(0.45 0.02 20)",
      "--accent": "oklch(0.7686 0.1647 70.0804)",
      "--primary": "oklch(0.7686 0.1647 70.0804)",
      "--font-sans": "Inter, sans-serif",
    },
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    type: "light",
    fontUrl: buildFontCssUrl("Outfit"),
    variables: {
      "--foreground": "oklch(0.1649 0.0352 281.8285)",
      "--bio-foreground": "oklch(0.3 0.05 280)",
      "--accent": "oklch(0.6726 0.2904 341.4084)",
      "--primary": "oklch(0.6726 0.2904 341.4084)",
      "--font-sans": "Outfit, sans-serif",
    },
  },
  supabase: {
    id: "supabase",
    name: "Supabase",
    type: "light",
    icon: "supabase",
    fontUrl: buildFontCssUrl("Outfit"), // Nanti Anda tinggal ganti nama font di sini
    variables: {
      "--foreground": "oklch(0.2046 0 0)",
      "--bio-foreground": "oklch(0.4 0 0)",
      "--accent": "oklch(0.8348 0.1302 160.9080)",
      "--primary": "oklch(0.8348 0.1302 160.9080)",
      "--font-sans": "Outfit, sans-serif",
    },
  },
  twitter: {
    id: "twitter",
    name: "X",
    type: "light",
    icon: "twitter",
    fontUrl: buildFontCssUrl("Open Sans"),
    variables: {
      "--foreground": "oklch(0.1884 0.0128 248.5103)",
      "--bio-foreground": "oklch(0.1884 0.0128 248.5103 / 0.8)",
      "--accent": "oklch(0.6723 0.1606 245)",
      "--primary": "oklch(0.6723 0.1606 245)",
      "--font-sans": "Open Sans, sans-serif",
    },
  },
  vercel: {
    id: "vercel",
    name: "Vercel ",
    type: "light",
    icon: "vercel",
    fontUrl: buildFontCssUrl("Inter"),
    variables: {
      "--foreground": "oklch(0 0 0)",
      "--bio-foreground": "oklch(0.44 0 0)",
      "--accent": "oklch(0 0 0)",
      "--primary": "oklch(0 0 0)",
      "--font-sans": "Inter, sans-serif",
    },
  },
  claude: {
    id: "claude",
    name: "Claude",
    type: "light",
    icon: "claude",
    fontUrl: buildFontCssUrl("Inter"),
    variables: {
      "--foreground": "oklch(0.3438 0.0269 95.7226)",
      "--bio-foreground": "oklch(0.6059 0.0075 97.4233)",
      "--accent": "oklch(0.6171 0.1375 39.0427)",
      "--primary": "oklch(0.6171 0.1375 39.0427)",
      "--font-sans": "ui-sans-serif, system-ui, sans-serif",
    },
  },
};

export const getThemeById = (id: string): ProfileTheme => {
  return THEMES[id] || THEMES["default"];
};
