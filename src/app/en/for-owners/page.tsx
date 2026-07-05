import { StaticContentPage } from "@/components/pages/StaticContentPage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  title: "For owners",
  description:
    "Invite us for a stay — we'll write an honest review and help you improve your glamping.",
  csPath: pagePath("forOwners", "cs"),
  enPath: pagePath("forOwners", "en"),
});

export default function Page() {
  return (
    <StaticContentPage
      locale="en"
      name="for-owners"
      pageKey="forOwners"
      withContactForm
    />
  );
}
