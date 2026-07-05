import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReviewCard } from "@/components/ReviewCard";
import { AREA_ICONS } from "@/components/Scorecard";
import { getReviews } from "@/lib/content";
import { getDictionary, type Locale, otherLocale, pagePath } from "@/lib/i18n";
import { RATING_AREAS } from "@/lib/schema";

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
        <section className="max-w-2xl py-16 sm:py-24">
          <h1 className="font-display text-4xl leading-tight text-forest-dark sm:text-5xl">
            {dict.home.heroTitle}{" "}
            <em className="not-italic text-terracotta">
              {dict.home.heroAccent}
            </em>
          </h1>
          <p className="mt-6 text-lg text-forest/80">{dict.home.heroText}</p>
          <Link
            href={pagePath("forOwners", locale)}
            className="mt-8 inline-block rounded-full bg-forest px-7 py-3 font-semibold text-cream hover:bg-forest-dark"
          >
            {dict.home.heroCta} →
          </Link>
        </section>

        <section className="py-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-forest-dark">
              {dict.home.latestTitle}
            </h2>
            <Link
              href={pagePath("reviews", locale)}
              className="text-sm text-terracotta underline"
            >
              {dict.home.allReviews} →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        </section>

        <section className="py-8">
          <h2 className="font-display text-2xl font-semibold text-forest-dark">
            {dict.home.focusTitle}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {RATING_AREAS.map((area) => (
              <div
                key={area}
                className="rounded-2xl border border-forest/10 bg-white/50 p-4 text-center"
              >
                <span className="text-2xl">{AREA_ICONS[area]}</span>
                <p className="mt-2 text-sm font-semibold text-forest-dark">
                  {dict.areas[area]}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="font-display text-2xl font-semibold text-forest-dark">
            {dict.home.howTitle}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-2xl border border-forest/10 bg-white/50 p-6"
              >
                <span className="font-display text-3xl font-bold text-moss">
                  {i + 1}
                </span>
                <h3 className="mt-2 font-display font-semibold text-forest-dark">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-forest/80">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-3xl bg-forest p-8 text-cream sm:p-12">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {dict.home.ownersTitle}
          </h2>
          <p className="mt-3 max-w-xl text-cream/90">{dict.home.ownersText}</p>
          <Link
            href={pagePath("forOwners", locale)}
            className="mt-6 inline-block rounded-full bg-terracotta px-7 py-3 font-semibold text-cream hover:bg-terracotta-dark"
          >
            {dict.home.ownersCta} →
          </Link>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
