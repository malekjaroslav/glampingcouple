import { StaticContentPage } from "@/components/pages/StaticContentPage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "cs",
  title: "O nás",
  description: "Kdo jsme a proč recenzujeme glampingy.",
  csPath: pagePath("about", "cs"),
  enPath: pagePath("about", "en"),
});

export default function Page() {
  return <StaticContentPage locale="cs" name="about" pageKey="about" />;
}
