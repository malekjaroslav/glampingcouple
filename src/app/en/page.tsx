import { HomePage } from "@/components/pages/HomePage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const TITLE = "glampingcouple — honest glamping reviews";

const base = pageMetadata({
  locale: "en",
  title: TITLE,
  description:
    "We are a couple touring glampings. We write honestly about what delighted us — and what isn't thought through.",
  csPath: pagePath("home", "cs"),
  enPath: pagePath("home", "en"),
});

export const metadata = { ...base, title: { absolute: TITLE } };

export default function Page() {
  return <HomePage locale="en" />;
}
