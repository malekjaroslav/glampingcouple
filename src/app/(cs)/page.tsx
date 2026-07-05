import { HomePage } from "@/components/pages/HomePage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const TITLE = "glampingcouple — poctivé recenze glampingů";

const base = pageMetadata({
  locale: "cs",
  title: TITLE,
  description:
    "Jsme pár, který objíždí glampingy. Píšeme poctivě, co nás nadchlo — i co není domyšlené.",
  csPath: pagePath("home", "cs"),
  enPath: pagePath("home", "en"),
});

export const metadata = { ...base, title: { absolute: TITLE } };

export default function Page() {
  return <HomePage locale="cs" />;
}
