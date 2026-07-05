import { ReviewDetailPage } from "@/components/pages/ReviewDetailPage";
import { getReviewBySlug, getReviews } from "@/lib/content";
import { pagePath, reviewPath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getReviews("cs").map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = getReviewBySlug(slug, "cs");
  if (!review) return {};
  return pageMetadata({
    locale: "cs",
    title: `${review.title} — recenze`,
    description: review.verdict,
    csPath: reviewPath("cs", slug),
    enPath: getReviewBySlug(slug, "en")
      ? reviewPath("en", slug)
      : pagePath("reviews", "en"),
    ogImage: review.cover ?? undefined,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ReviewDetailPage locale="cs" slug={slug} />;
}
