import type { Dictionary } from "@/lib/i18n";

export function ProsCons({
  liked,
  notThoughtThrough,
  dict,
}: {
  liked: string[];
  notThoughtThrough: string[];
  dict: Dictionary;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <section className="rounded-2xl bg-moss/15 p-6">
        <h2 className="font-display text-lg font-semibold text-forest-dark">
          ✓ {dict.review.liked}
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {liked.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="font-bold text-moss">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-2xl bg-terracotta/10 p-6">
        <h2 className="font-display text-lg font-semibold text-terracotta-dark">
          ✗ {dict.review.notThoughtThrough}
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {notThoughtThrough.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="font-bold text-terracotta">✗</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
