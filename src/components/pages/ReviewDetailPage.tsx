import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { ProsCons } from "@/components/ProsCons";
import { Scorecard } from "@/components/Scorecard";
import { VerdictBox } from "@/components/VerdictBox";
import { getReviewBySlug } from "@/lib/content";
import {
  formatStayDate,
  getDictionary,
  type Locale,
  otherLocale,
  pagePath,
  reviewPath,
} from "@/lib/i18n";
import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";

export async function ReviewDetailPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const review = getReviewBySlug(slug, locale);
  if (!review) notFound();
  const dict = getDictionary(locale);
  const other = otherLocale(locale);
  const altHref = getReviewBySlug(slug, other)
    ? reviewPath(other, slug)
    : pagePath("reviews", other);
  const bodyHtml = await markdownToHtml(review.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Campground",
      name: review.title,
      address: review.location,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.score,
      bestRating: 10,
      worstRating: 1,
    },
    author: { "@type": "Person", name: "Glamping Couple" },
    datePublished: review.stayDate.toISOString().slice(0, 10),
    reviewBody: review.verdict,
    url: `${SITE_URL}${reviewPath(locale, slug)}`,
  };

  return (
    <>
      <Header locale={locale} altHref={altHref} />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from validated build-time content
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link
          href={pagePath("reviews", locale)}
          className="text-sm text-terracotta underline"
        >
          ← {dict.review.backToReviews}
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-forest-dark sm:text-4xl">
          {review.title}
        </h1>
        <p className="mt-2 text-forest/70">
          {review.location} · {dict.review.stayDate}:{" "}
          {formatStayDate(review.stayDate, locale)}
        </p>

        <div className="mt-8">
          <Scorecard ratings={review.ratings} dict={dict} />
        </div>

        <article
          className="prose-body mt-8"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: html produced by our own remark pipeline from repo content
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <div className="mt-10">
          <Gallery
            photos={review.photos}
            title={review.title}
            photoLabel={dict.review.photo}
          />
        </div>

        <div className="mt-10">
          <ProsCons
            liked={review.liked}
            notThoughtThrough={review.notThoughtThrough}
            dict={dict}
          />
        </div>

        <div className="mt-10">
          <VerdictBox
            score={review.score}
            verdict={review.verdict}
            dict={dict}
          />
        </div>

        <section className="mt-14 rounded-2xl border border-forest/15 bg-sand/60 p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-forest-dark">
            {dict.review.ctaTitle}
          </h2>
          <Link
            href={pagePath("forOwners", locale)}
            className="mt-4 inline-block rounded-full bg-terracotta px-6 py-2 font-semibold text-cream hover:bg-terracotta-dark"
          >
            {dict.review.ctaButton}
          </Link>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
