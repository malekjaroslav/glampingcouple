import type { Dictionary } from "@/lib/i18n";
import {
  RATING_AREAS,
  type RatingArea,
  type ReviewFrontmatter,
} from "@/lib/schema";

export const AREA_ICONS: Record<RatingArea, string> = {
  sleeping: "🛏️",
  hygiene: "🚿",
  cleanliness: "✨",
  privacy: "🔒",
  surroundings: "🥾",
  supplies: "🛒",
};

export function Scorecard({
  ratings,
  dict,
}: {
  ratings: ReviewFrontmatter["ratings"];
  dict: Dictionary;
}) {
  return (
    <section className="rounded-[1.4rem] border border-forest/10 bg-white/70 p-6 shadow-forest/5 shadow-sm sm:p-7">
      <ul className="divide-y divide-dashed divide-forest/10">
        {RATING_AREAS.map((area, i) => (
          <li key={area} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand text-base">
              {AREA_ICONS[area]}
            </span>
            <span className="w-40 shrink-0 font-semibold text-forest-dark">
              {dict.areas[area]}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
              <span
                className="score-bar block h-full rounded-full bg-gradient-to-r from-moss to-terracotta"
                style={{
                  width: `${ratings[area] * 10}%`,
                  animationDelay: `${i * 90}ms`,
                }}
              />
            </span>
            <span className="w-12 text-right font-bold font-display text-forest-dark">
              {ratings[area]}
              <span className="font-normal text-forest/50 text-xs">/10</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
