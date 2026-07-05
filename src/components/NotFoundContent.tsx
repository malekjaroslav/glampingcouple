import { getDictionary } from "@/lib/i18n";

export function NotFoundContent() {
  const cs = getDictionary("cs");
  const en = getDictionary("en");
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-bold text-moss">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-dark">
        {cs.notFound.title} · <span lang="en">{en.notFound.title}</span>
      </h1>
      <div className="mt-6 flex gap-4">
        <a
          href="/"
          className="rounded-full bg-forest px-6 py-2 text-cream hover:bg-forest-dark"
        >
          {cs.notFound.back}
        </a>
        <a
          href="/en"
          lang="en"
          className="rounded-full border border-forest px-6 py-2 text-forest hover:bg-sand"
        >
          {en.notFound.back}
        </a>
      </div>
    </main>
  );
}
