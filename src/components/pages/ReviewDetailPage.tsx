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
          className="nav-link font-bold text-terracotta text-xs uppercase tracking-widest"
        >
          ← {dict.review.backToReviews}
        </Link>
        <p className="kicker mt-8">
          {review.location} · {formatStayDate(review.stayDate, locale)}
        </p>
        <h1 className="reveal mt-3 font-display text-4xl text-forest-dark leading-[1.08] sm:text-5xl">
          {review.title}
        </h1>

        <div className="mt-8">
          <Scorecard ratings={review.ratings} dict={dict} />
        </div>

        <article
          className="prose-body prose-story mt-10"
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

        <section className="mt-16 rounded-[1.6rem] border-2 border-terracotta/40 border-dashed bg-sand/50 p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl text-forest-dark">
            {dict.review.ctaTitle}
          </h2>
          <Link
            href={pagePath("forOwners", locale)}
            className="mt-5 inline-block rounded-full bg-terracotta px-7 py-2.5 font-bold text-cream transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-lg hover:shadow-terracotta/25"
          >
            {dict.review.ctaButton} →
          </Link>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
