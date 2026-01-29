"use server";

import { db } from "@/lib/db";
import type { BackgroundPreset } from "./schema";

/**
 * Get all background presets from database
 * Returns empty array if no presets found
 */
export async function getBackgroundPresets(): Promise<BackgroundPreset[]> {
  try {
    const presets = await db.backgroundPreset.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const CLOUDFRONT_URL = "https://d1uuiykksp6inc.cloudfront.net/wallappers";
    return presets.map((preset) => ({
      ...preset,
      url: `${CLOUDFRONT_URL}/${preset.url.split("/").pop()}`,
    }));
  } catch (error) {
    console.error("Failed to fetch background presets:", error);
    return [];
  }
}

/**
 * Get background presets by category
 */
export async function getBackgroundPresetsByCategory(category: string): Promise<BackgroundPreset[]> {
  try {
    const presets = await db.backgroundPreset.findMany({
      where: {
        category,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const CLOUDFRONT_URL = "https://d1uuiykksp6inc.cloudfront.net/wallappers";
    return presets.map((preset) => ({
      ...preset,
      url: `${CLOUDFRONT_URL}/${preset.url.split("/").pop()}`,
    }));
  } catch (error) {
    console.error("Failed to fetch background presets by category:", error);
    return [];
  }
}
