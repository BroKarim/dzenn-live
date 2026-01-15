"use client";

interface LinkIconProps {
  src: string;
  alt?: string;
  className?: string;
}

export function LinkIcon({ src, alt = "", className = "w-8 h-8" }: LinkIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
      }}
    />
  );
}

