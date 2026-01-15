"use client";

import type { Link } from "@/lib/hooks/use-links";
import { MainLinksList } from "./main-links-list";
import LinkClickTracker from "@/app/[username]/link-click-tracker";

interface TrackedMainLinksListProps {
  links: Link[];
  title?: string;
  className?: string;
}

export function TrackedMainLinksList({ links, title, className }: TrackedMainLinksListProps) {
  return (
    <MainLinksList
      links={links}
      title={title}
      className={className}
      renderLink={(link, linkComponent) => (
        <LinkClickTracker key={link.id} linkId={link.id}>
          {linkComponent}
        </LinkClickTracker>
      )}
    />
  );
}

