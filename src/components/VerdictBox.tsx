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
    <section className="flex items-center gap-6 rounded-2xl bg-forest p-6 text-cream sm:p-8">
      <ScoreBadge score={score} size="lg" variant="cream" />
      <div>
        <h2 className="font-display text-lg font-semibold">
          {dict.review.verdict}
        </h2>
        <p className="mt-1 italic text-cream/90">„{verdict}“</p>
      </div>
    </section>
  );
}
