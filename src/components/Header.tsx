import Link from "next/link";
import { getDictionary, type Locale, otherLocale, pagePath } from "@/lib/i18n";

export function Header({
  locale,
  altHref,
}: {
  locale: Locale;
  altHref: string;
}) {
  const dict = getDictionary(locale);
  return (
    <header className="border-b border-forest/10 bg-cream/90">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link
          href={pagePath("home", locale)}
          className="font-display text-xl font-semibold tracking-wide"
        >
          glamping<span className="text-terracotta">couple</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href={pagePath("reviews", locale)}
            className="hover:text-terracotta"
          >
            {dict.nav.reviews}
          </Link>
          <Link
            href={pagePath("about", locale)}
            className="hover:text-terracotta"
          >
            {dict.nav.about}
          </Link>
          <Link
            href={pagePath("forOwners", locale)}
            className="rounded-full bg-forest px-4 py-1.5 text-cream hover:bg-forest-dark"
          >
            {dict.nav.forOwners}
          </Link>
          <Link
            href={altHref}
            className="font-semibold uppercase tracking-wider hover:text-terracotta"
          >
            {otherLocale(locale) === "en" ? "EN" : "CZ"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
