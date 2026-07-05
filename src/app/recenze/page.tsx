import { ReviewsListPage } from "@/components/pages/ReviewsListPage";
import { getDictionary, pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "cs",
  title: getDictionary("cs").reviews.title,
  description: "Poctivé recenze glampingů po Česku i okolí.",
  csPath: pagePath("reviews", "cs"),
  enPath: pagePath("reviews", "en"),
});

export default function Page() {
  return <ReviewsListPage locale="cs" />;
}
