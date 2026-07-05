import { z } from "zod";

export const RATING_AREAS = [
  "sleeping",
  "hygiene",
  "cleanliness",
  "privacy",
  "surroundings",
  "supplies",
] as const;
export type RatingArea = (typeof RATING_AREAS)[number];

const ratingValue = z.number().int().min(1).max(10);

export const reviewFrontmatterSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  stayDate: z.coerce.date(),
  score: ratingValue,
  verdict: z.string().min(1),
  liked: z.array(z.string().min(1)).min(1),
  notThoughtThrough: z.array(z.string().min(1)).min(1),
  ratings: z.object({
    sleeping: ratingValue,
    hygiene: ratingValue,
    cleanliness: ratingValue,
    privacy: ratingValue,
    surroundings: ratingValue,
    supplies: ratingValue,
  }),
  tags: z.array(z.string()).default([]),
  published: z.boolean(),
});

export type ReviewFrontmatter = z.infer<typeof reviewFrontmatterSchema>;
