"use client";

import type { Link } from "@/lib/hooks/use-links";
import { IconLinksList } from "./icon-links-list";
import LinkClickTracker from "@/app/[username]/link-click-tracker";

interface TrackedIconLinksListProps {
  links: Link[];
  className?: string;
}

export function TrackedIconLinksList({ links, className }: TrackedIconLinksListProps) {
  return (
    <IconLinksList
      links={links}
      className={className}
      renderLink={(link, linkComponent) => (
        <LinkClickTracker key={link.id} linkId={link.id}>
          {linkComponent}
        </LinkClickTracker>
      )}
    />
  );
}

