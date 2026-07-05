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
    <header className="sticky top-0 z-40 border-forest/10 border-b bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <Link
          href={pagePath("home", locale)}
          className="group flex items-baseline gap-1 font-display text-xl tracking-wide"
        >
          <svg
            viewBox="0 0 24 20"
            className="h-4 w-5 self-center text-forest transition-colors group-hover:text-terracotta"
            aria-hidden="true"
          >
            <path
              d="M12 2 L22 18 L14.5 18 L12 13.5 L9.5 18 L2 18 Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-semibold text-forest-dark">glamping</span>
          <span className="font-semibold text-terracotta italic">couple</span>
        </Link>
        <nav className="flex items-center gap-6 text-[0.9rem]">
          <Link href={pagePath("reviews", locale)} className="nav-link">
            {dict.nav.reviews}
          </Link>
          <Link href={pagePath("about", locale)} className="nav-link">
            {dict.nav.about}
          </Link>
          <Link
            href={pagePath("forOwners", locale)}
            className="rounded-full bg-forest px-4 py-1.5 text-cream transition-all hover:-translate-y-0.5 hover:bg-forest-dark hover:shadow-forest/20 hover:shadow-md"
          >
            {dict.nav.forOwners}
          </Link>
          <Link
            href={altHref}
            className="rounded-full border border-forest/25 px-2.5 py-1 font-bold text-[0.7rem] tracking-widest transition-colors hover:border-terracotta hover:text-terracotta"
          >
            {otherLocale(locale) === "en" ? "EN" : "CZ"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
