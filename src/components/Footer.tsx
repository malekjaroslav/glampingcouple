import { getDictionary, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="mt-20 border-t border-forest/10 bg-sand/60">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm">
        <p className="font-display font-semibold">glampingcouple.com</p>
        <p>{dict.footer.tagline}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="underline hover:text-terracotta"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
