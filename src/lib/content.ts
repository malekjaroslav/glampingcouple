import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import { type ReviewFrontmatter, reviewFrontmatterSchema } from "@/lib/schema";

export type Review = ReviewFrontmatter & {
  slug: string;
  locale: Locale;
  body: string;
  photos: string[];
  cover: string | null;
};

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), "content");
const PHOTO_RE = /\.(jpe?g|png|webp|avif)$/i;

function loadReview(
  slug: string,
  locale: Locale,
  contentDir: string,
): Review | null {
  const dir = path.join(contentDir, "reviews", slug);
  const file = path.join(dir, `${locale}.md`);
  if (!existsSync(file)) {
    if (locale === "cs")
      throw new Error(`[content] ${slug}: missing required cs.md`);
    console.warn(`[content] ${slug}: missing en.md — skipped in EN listing`);
    return null;
  }
  const { data, content } = matter(readFileSync(file, "utf8"));
  const parsed = reviewFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `[content] ${slug}/${locale}.md: invalid frontmatter\n${z.prettifyError(parsed.error)}`,
    );
  }
  const photosDir = path.join(dir, "photos");
  const files = existsSync(photosDir)
    ? readdirSync(photosDir)
        .filter((f) => PHOTO_RE.test(f))
        .sort()
    : [];
  const photos = files.map((f) => `/reviews/${slug}/${f}`);
  const cover = files.includes("cover.jpg")
    ? `/reviews/${slug}/cover.jpg`
    : (photos[0] ?? null);
  return { ...parsed.data, slug, locale, body: content, photos, cover };
}

export function getReviews(
  locale: Locale,
  contentDir = DEFAULT_CONTENT_DIR,
): Review[] {
  const reviewsDir = path.join(contentDir, "reviews");
  if (!existsSync(reviewsDir)) return [];
  return readdirSync(reviewsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => loadReview(entry.name, locale, contentDir))
    .filter((review): review is Review => review !== null)
    .filter((review) => review.published)
    .sort((a, b) => b.stayDate.getTime() - a.stayDate.getTime());
}

export function getReviewBySlug(
  slug: string,
  locale: Locale,
  contentDir = DEFAULT_CONTENT_DIR,
): Review | null {
  const dir = path.join(contentDir, "reviews", slug);
  if (!existsSync(dir)) return null;
  const review = loadReview(slug, locale, contentDir);
  return review?.published ? review : null;
}
