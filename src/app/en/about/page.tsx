import { StaticContentPage } from "@/components/pages/StaticContentPage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  title: "About us",
  description: "Who we are and why we review glampings.",
  csPath: pagePath("about", "cs"),
  enPath: pagePath("about", "en"),
});

export default function Page() {
  return <StaticContentPage locale="en" name="about" pageKey="about" />;
}
