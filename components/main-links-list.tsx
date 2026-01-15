"use client";

import type { Link } from "@/lib/hooks/use-links";
import { MainLink } from "./main-link";

interface MainLinksListProps {
  links: Link[];
  title?: string;
  className?: string;
  onLinkClick?: (link: Link) => void;
  showDescriptions?: boolean;
  linkDescriptions?: Record<string, string | null>;
  renderLink?: (link: Link, linkComponent: React.ReactNode) => React.ReactNode;
}

export function MainLinksList({
  links,
  title = "My Links",
  className = "",
  onLinkClick,
  showDescriptions = false,
  linkDescriptions = {},
  renderLink,
}: MainLinksListProps) {
  if (links.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <div>
          <h2 className="text-xs font-medium text-zinc-900 mb-1">{title}</h2>
        </div>
      )}
      <div className="grid gap-3 grid-cols-1">
        {links.map((link) => {
          const linkComponent = (
            <MainLink
              key={link.id}
              link={link}
              onClick={() => onLinkClick?.(link)}
              showDescription={showDescriptions}
              description={linkDescriptions[link.id] || null}
            />
          );

          return renderLink ? renderLink(link, linkComponent) : linkComponent;
        })}
      </div>
    </div>
  );
}

