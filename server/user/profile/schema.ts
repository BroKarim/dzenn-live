import { z } from "zod";
import { BackgroundType, ProfileLayout, CardTexture } from "@/lib/generated/prisma/enums";

export const BackgroundEffectsSchema = z.object({
  blur: z.number().min(0).max(20),
  noise: z.number().min(0).max(100),
  brightness: z.number().min(50).max(150),
  saturation: z.number().min(0).max(200),
  contrast: z.number().min(50).max(150),
});

export const ProfileSchema = z.object({
  displayName: z.string().min(1, "Name is required").max(50),
  bio: z.string().max(160).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable().or(z.literal("")).or(z.literal(null)),
  layout: z.nativeEnum(ProfileLayout),

  bgType: z.nativeEnum(BackgroundType),
  bgColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  bgGradientFrom: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .nullable(),
  bgGradientTo: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .nullable(),
  bgWallpaper: z.string().optional().nullable(),
  bgImage: z.string().optional().nullable(),

  blurAmount: z.number().min(0).max(40),
  padding: z.number().min(0).max(100),
  cardTexture: z.nativeEnum(CardTexture),
  bgEffects: BackgroundEffectsSchema,
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
