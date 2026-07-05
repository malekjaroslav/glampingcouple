import { StaticContentPage } from "@/components/pages/StaticContentPage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "cs",
  title: "Pro majitele",
  description:
    "Pozvěte nás na pobyt — napíšeme poctivou recenzi a pomůžeme vám zlepšit váš glamping.",
  csPath: pagePath("forOwners", "cs"),
  enPath: pagePath("forOwners", "en"),
});

export default function Page() {
  return (
    <StaticContentPage
      locale="cs"
      name="for-owners"
      pageKey="forOwners"
      withContactForm
    />
  );
}
