import { z } from "zod";
import validator from "validator";
import { sanitizeTitle, sanitizeUrl } from "../sanitize";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores allowed")
  .toLowerCase();

export const linkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be at most 300 characters")
    .transform((val) => sanitizeTitle(val)),
  url: z
    .string()
    .min(1, "URL is required")
    .refine((val) => {
      if (!val || val.trim() === "") return false;
      
      const normalizedUrl = val.startsWith("http://") || val.startsWith("https://") 
        ? val 
        : `https://${val}`;
      
      return validator.isURL(normalizedUrl, {
        protocols: ["http", "https"],
        require_protocol: false,
        require_valid_protocol: true,
        require_host: true,
        require_port: false,
        allow_protocol_relative_urls: false,
        validate_length: true,
      });
    }, "Invalid URL format. Please enter a valid URL with a proper domain (e.g., example.com or https://example.com)")
    .transform((val) => sanitizeUrl(val))
    .refine((val) => val.length > 0, "Invalid URL format"),
  icon: z.string().optional().nullable(),
});

export const profileSchema = z.object({
  title: z.string().max(100, "Title must be at most 100 characters").optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  theme: z.string().default("default"),
  calLink: z.string().max(200, "Cal.com link must be at most 200 characters").optional().nullable(),
});

export const linkUpdateSchema = linkSchema
  .extend({
    id: z.string().optional(),
    position: z.number().int().min(0),
    isActive: z.boolean().default(true),
    previewImageUrl: z.string().url().nullable().optional(),
    previewDescription: z.string().nullable().optional(),
  })
  .partial();

export const collectionCategorySchema = z.enum([
  "UI_LIBRARY",
  "RESOURCES",
  "SITES",
  "TOOLS",
  "OTHER",
]);

export const collectionLinkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be at most 300 characters")
    .transform((val) => sanitizeTitle(val)),
  url: z
    .string()
    .min(1, "URL is required")
    .refine((val) => {
      if (!val || val.trim() === "") return false;
      
      const normalizedUrl = val.startsWith("http://") || val.startsWith("https://") 
        ? val 
        : `https://${val}`;
      
      return validator.isURL(normalizedUrl, {
        protocols: ["http", "https"],
        require_protocol: false,
        require_valid_protocol: true,
        require_host: true,
        require_port: false,
        allow_protocol_relative_urls: false,
        validate_length: true,
      });
    }, "Invalid URL format. Please enter a valid URL with a proper domain (e.g., example.com or https://example.com)")
    .transform((val) => sanitizeUrl(val))
    .refine((val) => val.length > 0, "Invalid URL format"),
  icon: z.string().optional().nullable(),
});

export const collectionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .transform((val) => sanitizeTitle(val)),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .nullable(),
  category: collectionCategorySchema.default("OTHER"),
  links: z.array(collectionLinkSchema).min(1, "At least one link is required"),
});

export const collectionUpdateSchema = collectionSchema.partial().extend({
  links: z.array(collectionLinkSchema).optional(),
});

export const voteSchema = z.object({
  voteType: z.enum(["UP", "DOWN"]),
});

