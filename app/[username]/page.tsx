import { getPublicProfile } from "@/server/website/profile";
import type { Metadata } from "next";
import { ProfileView } from "./profile-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ username: string }>;
};

// Metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `@${username} | OneLink`,
    description: `Visit ${username}'s profile on OneLink`,
  };
}

/**
 * Public profile page
 * Uses simple server-side rendering with data fetching
 */
export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  // Fetch user profile
  const profile = await getPublicProfile(username);

  // Handle not found
  if (!profile || !profile.isPublished) {
    notFound();
  }

  // Render profile
  return <ProfileView user={profile} />;
}
