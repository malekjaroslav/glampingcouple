import { getDictionary, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="mt-24 border-forest/15 border-t border-dashed bg-sand/50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-2xl text-forest-dark">
              glamping<span className="text-terracotta italic">couple</span>
              <span className="text-moss">.com</span>
            </p>
            <p className="mt-1 text-forest/70 text-sm">{dict.footer.tagline}</p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-full border border-forest/20 px-5 py-2 text-sm transition-colors hover:border-terracotta hover:text-terracotta"
          >
            ✉ {CONTACT_EMAIL}
          </a>
        </div>
        <p className="mt-8 flex items-center gap-3 text-forest/50 text-xs tracking-widest">
          <svg viewBox="0 0 24 20" className="h-3 w-4" aria-hidden="true">
            <path
              d="M12 2 L22 18 L14.5 18 L12 13.5 L9.5 18 L2 18 Z"
              fill="currentColor"
            />
          </svg>
          © {new Date().getFullYear()} glampingcouple
        </p>
      </div>
    </footer>
  );
}
