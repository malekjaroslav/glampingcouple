import type { MetadataRoute } from "next";
import { getReviews } from "@/lib/content";
import { LOCALES, type PageKey, pagePath, reviewPath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: PageKey[] = ["home", "reviews", "about", "forOwners"];
  const staticEntries = pages.flatMap((page) =>
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
