"use client";

import { useQuery } from "@tanstack/react-query";

type GitHubStarsResponse = {
  stargazersCount: number;
  repo: string;
};

async function fetchGitHubStars(repo: string): Promise<GitHubStarsResponse> {
  const response = await fetch(`/api/github/stars?repo=${encodeURIComponent(repo)}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub stars");
  }
  
  return response.json();
}

export function useGitHubStars(repo: string) {
  return useQuery({
    queryKey: ["github-stars", repo],
    queryFn: () => fetchGitHubStars(repo),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 2,
    retryDelay: 1000,
  });
}

