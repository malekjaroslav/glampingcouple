import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReviewCard } from "@/components/ReviewCard";
import { AREA_ICONS } from "@/components/Scorecard";
import { getReviews } from "@/lib/content";
import { getDictionary, type Locale, otherLocale, pagePath } from "@/lib/i18n";
import { RATING_AREAS } from "@/lib/schema";

function HeroStamp() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="stamp-spin h-32 w-32 text-terracotta sm:h-40 sm:w-40"
      aria-hidden="true"
    >
      <title>glampingcouple stamp</title>
      <defs>
        <path
          id="stamp-circle"
          d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
        />
      </defs>
      <circle
        cx="60"
        cy="60"
        r="57"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 5"
      />
      <text
        fill="currentColor"
        fontSize="10.5"
        fontWeight="700"
        letterSpacing="3.4"
      >
        <textPath href="#stamp-circle">GLAMPINGCOUPLE · CZ / EN ·</textPath>
      </text>
      <path
        d="M60 44 L76 72 L64 72 L60 65 L56 72 L44 72 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Squiggle() {
  return (
    <svg
      viewBox="0 0 220 14"
      className="mt-1 h-3 w-48 text-moss sm:w-64"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 9 C 22 2, 42 12, 62 7 S 102 2, 122 8 S 162 12, 182 6 S 210 4, 218 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const latest = getReviews(locale).slice(0, 3);
  const steps = [
    { title: dict.home.howStep1Title, text: dict.home.howStep1Text },
    { title: dict.home.howStep2Title, text: dict.home.howStep2Text },
    { title: dict.home.howStep3Title, text: dict.home.howStep3Text },
  ];

  return (
    <>
      <Header locale={locale} altHref={pagePath("home", otherLocale(locale))} />
      <main className="mx-auto max-w-5xl px-4">
        {/* Hero */}
        <section className="relative flex items-center justify-between gap-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="kicker reveal">{dict.footer.tagline}</p>
            <h1 className="reveal reveal-1 mt-5 font-display text-5xl text-forest-dark leading-[1.05] sm:text-7xl">
              {dict.home.heroTitle}{" "}
              <em className="text-terracotta italic">{dict.home.heroAccent}</em>
            </h1>
            <div className="reveal reveal-2">
              <Squiggle />
            </div>
            <p className="reveal reveal-2 mt-6 max-w-xl text-forest/80 text-lg leading-relaxed">
              {dict.home.heroText}
            </p>
            <div className="reveal reveal-3 mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={pagePath("forOwners", locale)}
                className="rounded-full bg-forest px-8 py-3.5 font-bold text-cream transition-all hover:-translate-y-0.5 hover:bg-forest-dark hover:shadow-forest/25 hover:shadow-lg"
              >
                {dict.home.heroCta} →
              </Link>
              <Link
                href={pagePath("reviews", locale)}
                className="rounded-full border border-forest/25 px-8 py-3.5 font-bold transition-colors hover:border-terracotta hover:text-terracotta"
              >
                {dict.home.allReviews}
              </Link>
            </div>
          </div>
          <div className="reveal reveal-3 hidden shrink-0 md:block">
            <HeroStamp />
          </div>
        </section>

        {/* Latest reviews */}
        <section className="py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="kicker">01</p>
              <h2 className="mt-2 font-display text-3xl text-forest-dark sm:text-4xl">
                {dict.home.latestTitle}
              </h2>
            </div>
            <Link
              href={pagePath("reviews", locale)}
              className="nav-link mb-1 shrink-0 font-bold text-sm text-terracotta uppercase tracking-widest"
            >
              {dict.home.allReviews} →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        </section>

        {/* Focus areas */}
        <section className="py-14">
          <p className="kicker">02</p>
          <h2 className="mt-2 font-display text-3xl text-forest-dark sm:text-4xl">
            {dict.home.focusTitle}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {RATING_AREAS.map((area, i) => (
              <div
                key={area}
                className={`rounded-[1.2rem] border border-forest/10 bg-white/60 p-4 text-center shadow-forest/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-moss/50 hover:shadow-md ${
                  i % 2 === 0 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"
                }`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sand text-xl">
                  {AREA_ICONS[area]}
                </span>
                <p className="mt-2.5 font-bold text-[0.8rem] text-forest-dark leading-tight">
                  {dict.areas[area]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How we review */}
        <section className="py-14">
          <p className="kicker">03</p>
          <h2 className="mt-2 font-display text-3xl text-forest-dark sm:text-4xl">
            {dict.home.howTitle}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative overflow-hidden rounded-[1.4rem] border border-forest/10 bg-white/60 p-6 pt-8 shadow-forest/5 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1 right-3 font-display text-7xl text-moss/20 italic"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative font-display font-semibold text-forest-dark text-xl">
                  {step.title}
                </h3>
                <p className="relative mt-2.5 text-forest/80 text-sm leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Owners CTA */}
        <section className="relative mb-10 overflow-hidden rounded-[2.5rem] bg-forest p-8 text-cream sm:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-moss/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-12 h-80 w-80 rounded-full bg-terracotta/30 blur-3xl"
          />
          <svg
            viewBox="0 0 24 20"
            className="pointer-events-none absolute right-10 bottom-8 h-16 w-20 text-cream/10 sm:h-24 sm:w-32"
            aria-hidden="true"
          >
            <path
              d="M12 2 L22 18 L14.5 18 L12 13.5 L9.5 18 L2 18 Z"
              fill="currentColor"
            />
          </svg>
          <div className="relative">
            <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
              {dict.home.ownersTitle}
            </h2>
            <p className="mt-4 max-w-xl text-cream/85 text-lg leading-relaxed">
              {dict.home.ownersText}
            </p>
            <Link
              href={pagePath("forOwners", locale)}
              className="mt-8 inline-block rounded-full bg-terracotta px-8 py-3.5 font-bold text-cream transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-black/20 hover:shadow-lg"
            >
              {dict.home.ownersCta} →
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
