export type ProfileTheme = {
  id: string;
  name: string;
  type: "light" | "dark";
  variables: Record<string, string>;
  fontUrl?: string; // Google Fonts URL for dynamic loading
};

export const THEMES: Record<string, ProfileTheme> = {
  default: {
    id: "default",
    name: "Default",
    type: "dark",
    variables: {
      "--foreground": "oklch(0.985 0 0)",
      "--bio-foreground": "oklch(0.1450 0 0)",
      "--card": "oklch(0.15 0 0 / 0.4)",
      "--card-foreground": "oklch(0.98 0 0)",
      "--card-border": "oklch(1 0 0 / 0.1)",
      "--accent": "oklch(0.205 0 0)",
      "--font-sans": "Inter, sans-serif",
      "--radius": "1.25rem",
    },
  },
  amber: {
    id: "amber",
    name: "Amber Glow",
    type: "light",
    fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    variables: {
      "--foreground": "oklch(0.2686 0 0)",
      "--bio-foreground": "oklch(0.45 0.02 20)",
      "--card": "oklch(1.0000 0 0 / 0.8)",
      "--card-foreground": "oklch(0.2686 0 0)",
      "--primary": "oklch(0.7686 0.1647 70.0804)",
      "--accent": "oklch(0.7686 0.1647 70.0804)",
      "--border": "oklch(0.9276 0.0058 264.5313)",
      "--font-sans": "Inter, sans-serif",
      "--radius": "0.375rem",
    },
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    type: "light",
    fontUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
    variables: {
      "--foreground": "oklch(0.1649 0.0352 281.8285)",
      "--bio-foreground": "oklch(0.3 0.05 280)",
      "--card": "oklch(1.0000 0 0 / 0.85)",
      "--card-foreground": "oklch(0.1649 0.0352 281.8285)",
      "--primary": "oklch(0.6726 0.2904 341.4084)",
      "--accent": "oklch(0.8903 0.1739 171.2690)",
      "--border": "oklch(0.9205 0.0086 225.0878)",
      "--font-sans": "Outfit, sans-serif",
      "--radius": "0px",
    },
  },
  supabase: {
    id: "supabase",
    name: "Supabase",
    type: "light",
    fontUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
    variables: {
      "--foreground": "oklch(0.2046 0 0)",
      "--bio-foreground": "oklch(0.4 0 0)",
      "--card": "oklch(0.9911 0 0 / 0.8)",
      "--card-foreground": "oklch(0.2046 0 0)",
      "--primary": "oklch(0.8348 0.1302 160.9080)",
      "--accent": "oklch(0.8348 0.1302 160.9080)",
      "--border": "oklch(0.9037 0 0)",
      "--font-sans": "Outfit, sans-serif",
      "--radius": "0.5rem",
    },
  },
  twitter: {
    id: "twitter",
    name: "Twitter",
    type: "light",
    fontUrl: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap",
    variables: {
      "--foreground": "oklch(0.1884 0.0128 248.5103)",
      "--primary": "oklch(0.6723 0.1606 245)",
      "--bio-foreground": "oklch(0.1884 0.0128 248.5103 / 0.8)",
      "--card": "oklch(0.9784 0.0011 197.1387 / 0.9)",
      "--card-foreground": "oklch(0.1884 0.0128 248.5103)",
      "--accent": "oklch(0.6723 0.1606 245)",
      "--font-sans": "Open Sans, sans-serif",
      "--radius": "1.3rem",
    },
  },
  vercel: {
    id: "vercel",
    name: "Vercel",
    type: "light",
    fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    variables: {
      "--foreground": "oklch(0 0 0)",
      "--primary": "oklch(0 0 0)",
      "--bio-foreground": "oklch(0.44 0 0)",
      "--card": "oklch(1 0 0 / 0.9)",
      "--card-foreground": "oklch(0 0 0)",
      "--accent": "oklch(0.94 0 0)",
      "--font-sans": "Geist, sans-serif",
      "--radius": "0.5rem",
    },
  },
  claude: {
    id: "claude",
    name: "Claude",
    type: "light",
    fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    variables: {
      "--foreground": "oklch(0.3438 0.0269 95.7226)",
      "--primary": "oklch(0.6171 0.1375 39.0427)",
      "--bio-foreground": "oklch(0.6059 0.0075 97.4233)",
      "--card": "oklch(0.9818 0.0054 95.0986 / 0.9)",
      "--card-foreground": "oklch(0.1908 0.0020 106.5859)",
      "--accent": "oklch(0.4334 0.0177 98.6)",
      "--font-sans": "ui-sans-serif, system-ui, sans-serif",
      "--radius": "0.5rem",
    },
  },
};

export const getThemeById = (id: string): ProfileTheme => {
  return THEMES[id] || THEMES["default"];
};
