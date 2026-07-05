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
      <main className="mx-auto max-w-3xl px-4 py-14">
        <p className="kicker">glampingcouple</p>
        <h1 className="reveal mt-3 font-display text-4xl text-forest-dark sm:text-5xl">
          {page.title}
        </h1>
        <article
          className="prose-body mt-8"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: html produced by our own remark pipeline from repo content
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        {withContactForm && (
          <section className="mt-12 rounded-[1.6rem] border-2 border-terracotta/40 border-dashed bg-sand/50 p-6 sm:p-9">
            <ContactForm dict={dict} email={CONTACT_EMAIL} />
          </section>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
