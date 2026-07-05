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
      <section className="rounded-[1.4rem] border border-moss/30 bg-moss/15 p-6 rotate-[0.35deg]">
        <h2 className="flex items-center gap-2.5 font-display font-semibold text-forest-dark text-lg">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-moss font-bold text-cream text-sm">
            ✓
          </span>
          {dict.review.liked}
        </h2>
        <ul className="mt-4 space-y-2.5 text-[0.95rem]">
          {liked.map((item) => (
            <li key={item} className="flex gap-2.5 leading-relaxed">
              <span className="font-bold text-moss">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="-rotate-[0.35deg] rounded-[1.4rem] border border-terracotta/30 bg-terracotta/10 p-6">
        <h2 className="flex items-center gap-2.5 font-display font-semibold text-lg text-terracotta-dark">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-terracotta font-bold text-cream text-sm">
            ✗
          </span>
          {dict.review.notThoughtThrough}
        </h2>
        <ul className="mt-4 space-y-2.5 text-[0.95rem]">
          {notThoughtThrough.map((item) => (
            <li key={item} className="flex gap-2.5 leading-relaxed">
              <span className="font-bold text-terracotta">✗</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
