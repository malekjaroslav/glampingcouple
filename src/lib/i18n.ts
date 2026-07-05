import cs from "@/dictionaries/cs.json";
import en from "@/dictionaries/en.json";

export const LOCALES = ["cs", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "cs";

export type Dictionary = typeof cs;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "cs" ? cs : (en as Dictionary);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "cs" ? "en" : "cs";
}

export type PageKey = "home" | "reviews" | "about" | "forOwners";

const ROUTES: Record<PageKey, Record<Locale, string>> = {
  home: { cs: "/", en: "/en" },
  reviews: { cs: "/recenze", en: "/en/reviews" },
  about: { cs: "/o-nas", en: "/en/about" },
  forOwners: { cs: "/pro-majitele", en: "/en/for-owners" },
};

export function pagePath(page: PageKey, locale: Locale): string {
  return ROUTES[page][locale];
}

export function reviewPath(locale: Locale, slug: string): string {
  return locale === "cs" ? `/recenze/${slug}` : `/en/reviews/${slug}`;
}

export function formatStayDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale === "cs" ? "cs-CZ" : "en-GB", {
    month: "long",
    year: "numeric",
  });
}
