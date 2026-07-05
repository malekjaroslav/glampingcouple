import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPage, type StaticPageName } from "@/lib/content";
import {
  getDictionary,
  type Locale,
  otherLocale,
  type PageKey,
  pagePath,
} from "@/lib/i18n";
import { markdownToHtml } from "@/lib/markdown";
import { CONTACT_EMAIL } from "@/lib/site";

export async function StaticContentPage({
  locale,
  name,
  pageKey,
  withContactForm = false,
}: {
  locale: Locale;
  name: StaticPageName;
  pageKey: PageKey;
  withContactForm?: boolean;
}) {
  const dict = getDictionary(locale);
  const page = getPage(name, locale);
  const bodyHtml = await markdownToHtml(page.body);

  return (
    <>
      <Header
        locale={locale}
        altHref={pagePath(pageKey, otherLocale(locale))}
      />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-semibold text-forest-dark sm:text-4xl">
          {page.title}
        </h1>
        <article
          className="prose-body mt-6"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: html produced by our own remark pipeline from repo content
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        {withContactForm && (
          <section className="mt-12 rounded-2xl border border-forest/15 bg-sand/50 p-6 sm:p-8">
            <ContactForm dict={dict} email={CONTACT_EMAIL} />
          </section>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
