import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReviewCard } from "@/components/ReviewCard";
import { getReviews } from "@/lib/content";
import { getDictionary, type Locale, otherLocale, pagePath } from "@/lib/i18n";

export function ReviewsListPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const reviews = getReviews(locale);
  return (
    <>
      <Header
        locale={locale}
        altHref={pagePath("reviews", otherLocale(locale))}
      />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <p className="kicker">{dict.footer.tagline}</p>
        <h1 className="reveal mt-3 font-display text-4xl text-forest-dark sm:text-5xl">
          {dict.reviews.title}
        </h1>
        {reviews.length === 0 ? (
          <p className="mt-8 text-forest/70">{dict.reviews.empty}</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
