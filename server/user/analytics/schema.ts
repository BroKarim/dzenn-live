import { z } from "zod";

// ===========================
// Date Range Schema
// ===========================
export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type DateRange = z.infer<typeof dateRangeSchema>;

// ===========================
// Analytics Query Schemas
// ===========================
export const linkStatsQuerySchema = z.object({
  linkId: z.string().min(1, "Link ID is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  includeBots: z.boolean().optional().default(false),
});

export const profileStatsQuerySchema = z.object({
  profileId: z.string().min(1, "Profile ID is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  includeBots: z.boolean().optional().default(false),
});

export const linkClickCountQuerySchema = z.object({
  linkId: z.string().min(1, "Link ID is required"),
  includeBots: z.boolean().optional().default(false),
});

export const linksClickCountsQuerySchema = z.object({
  linkIds: z.array(z.string()).min(1, "At least one link ID is required"),
  includeBots: z.boolean().optional().default(false),
});

type LinkStatsQuery = z.infer<typeof linkStatsQuerySchema>;
type ProfileStatsQuery = z.infer<typeof profileStatsQuerySchema>;
type LinkClickCountQuery = z.infer<typeof linkClickCountQuerySchema>;
type LinksClickCountsQuery = z.infer<typeof linksClickCountsQuerySchema>;
