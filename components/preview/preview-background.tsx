import { PatternRenderer } from "./pattern-renderer";

interface PreviewBackgroundProps {
  profile: {
    bgType: string;
    bgColor: string;
    bgGradientFrom: string | null;
    bgGradientTo: string | null;
    bgWallpaper: string | null;
    bgImage: string | null;
    bgEffects: any;
    bgPattern: any;
  };
}

export function PreviewBackground({ profile }: PreviewBackgroundProps) {
  const bgEffects = profile.bgEffects as any;
  const bgPattern = (profile.bgPattern as any) || { type: "none", color: "#ffffff", opacity: 10, thickness: 1, scale: 20 };

  const getBackgroundStyle = () => {
    switch (profile.bgType) {
      case "gradient":
        return { background: `linear-gradient(135deg, ${profile.bgGradientFrom} 0%, ${profile.bgGradientTo} 100%)` };
      case "wallpaper": {
        const fileName = profile.bgWallpaper?.split("/").pop();
        const wallappersUrl = fileName ? `https://d1uuiykksp6inc.cloudfront.net/wallappers/${fileName}` : profile.bgWallpaper;
        return {
          backgroundImage: `url(${wallappersUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      }
      case "image":
        return {
          backgroundImage: `url(${profile.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      default:
        return { backgroundColor: profile.bgColor };
    }
  };

  return (
    <>
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          ...getBackgroundStyle(),
          filter: `
            blur(${bgEffects?.blur ?? 0}px) 
            brightness(${bgEffects?.brightness ?? 100}%) 
            saturate(${bgEffects?.saturation ?? 100}%) 
            contrast(${bgEffects?.contrast ?? 100}%)
          `,
          transform: (bgEffects?.blur ?? 0) > 0 ? "scale(1.1)" : "scale(1)",
        }}
      />

      {/* Pattern Layer */}
      <PatternRenderer type={bgPattern.type} color={bgPattern.color} opacity={bgPattern.opacity} thickness={bgPattern.thickness} scale={bgPattern.scale} />

      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: (bgEffects?.noise ?? 0) / 100,
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
          filter: "contrast(150%) brightness(100%)",
        }}
      />
    </>
  );
}
