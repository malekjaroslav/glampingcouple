import { ReviewsListPage } from "@/components/pages/ReviewsListPage";
import { getDictionary, pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  title: getDictionary("en").reviews.title,
  description: "Honest glamping reviews across Czechia and beyond.",
  csPath: pagePath("reviews", "cs"),
  enPath: pagePath("reviews", "en"),
});

export default function Page() {
  return <ReviewsListPage locale="en" />;
}
