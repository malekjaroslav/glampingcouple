import type { MetadataRoute } from "next";
import { getReviews } from "@/lib/content";
import { LOCALES, PAGE_KEYS, pagePath, reviewPath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = PAGE_KEYS.flatMap((page) =>
    LOCALES.map((locale) => ({ url: `${SITE_URL}${pagePath(page, locale)}` })),
  );
  const reviewEntries = LOCALES.flatMap((locale) =>
    getReviews(locale).map((review) => ({
      url: `${SITE_URL}${reviewPath(locale, review.slug)}`,
      lastModified: review.stayDate,
    })),
  );
  return [...staticEntries, ...reviewEntries];
}
