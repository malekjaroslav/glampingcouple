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
    <section className="rounded-2xl border border-forest/10 bg-white/60 p-6">
      <ul className="space-y-3">
        {RATING_AREAS.map((area) => (
          <li key={area} className="flex items-center gap-3 text-sm">
            <span className="w-6 text-lg">{AREA_ICONS[area]}</span>
            <span className="w-40 shrink-0">{dict.areas[area]}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
              <span
                className="block h-full rounded-full bg-terracotta"
                style={{ width: `${ratings[area] * 10}%` }}
              />
            </span>
            <span className="w-12 text-right font-display font-bold text-forest-dark">
              {ratings[area]}/10
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
