import { ScoreBadge } from "@/components/ScoreBadge";
import type { Dictionary } from "@/lib/i18n";

export function VerdictBox({
  score,
  verdict,
  dict,
}: {
  score: number;
  verdict: string;
  dict: Dictionary;
}) {
  return (
    <section className="relative flex items-center gap-6 overflow-hidden rounded-[1.6rem] bg-forest p-7 text-cream sm:gap-8 sm:p-9">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-7 right-4 font-display text-[7rem] text-cream/10 italic leading-none"
      >
        „
      </span>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-moss/25 blur-2xl"
      />
      <ScoreBadge score={score} size="lg" variant="cream" />
      <div className="relative">
        <h2 className="font-bold text-[0.7rem] text-cream/70 uppercase tracking-[0.24em]">
          {dict.review.verdict}
        </h2>
        <p className="mt-2 font-display text-cream text-xl italic leading-snug sm:text-2xl">
          „{verdict}“
        </p>
      </div>
    </section>
  );
}
