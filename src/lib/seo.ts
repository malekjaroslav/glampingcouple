import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

export function pageMetadata(opts: {
  locale: Locale;
  title: string;
  description: string;
  csPath: string;
  enPath: string;
  ogImage?: string;
}): Metadata {
  const { locale, title, description, csPath, enPath, ogImage } = opts;
  return {
    title,
    description,
    alternates: {
      canonical: locale === "cs" ? csPath : enPath,
      languages: { cs: csPath, en: enPath, "x-default": csPath },
    },
    openGraph: {
      title,
      description,
      locale: locale === "cs" ? "cs_CZ" : "en_GB",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
