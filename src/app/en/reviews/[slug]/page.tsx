import { ReviewDetailPage } from "@/components/pages/ReviewDetailPage";
import { getReviewBySlug, getReviews } from "@/lib/content";
import { reviewPath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getReviews("en").map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = getReviewBySlug(slug, "en");
  if (!review) return {};
  return pageMetadata({
    locale: "en",
    title: `${review.title} — review`,
    description: review.verdict,
    csPath: reviewPath("cs", slug),
    enPath: reviewPath("en", slug),
    ogImage: review.cover ?? undefined,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ReviewDetailPage locale="en" slug={slug} />;
}
