import Image from "next/image";
import Link from "next/link";
import { ScoreBadge } from "@/components/ScoreBadge";
import type { Review } from "@/lib/content";
import { getDictionary, reviewPath } from "@/lib/i18n";

export function ReviewCard({ review }: { review: Review }) {
  const dict = getDictionary(review.locale);
  return (
    <Link
      href={reviewPath(review.locale, review.slug)}
      className="group overflow-hidden rounded-2xl border border-forest/10 bg-white/60 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-moss to-forest">
        {review.cover ? (
          <Image
            src={review.cover}
            alt={review.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-5xl">
            🏕️
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-forest-dark">
            {review.title}
          </h3>
          <p className="mt-1 text-sm text-forest/70">{review.location}</p>
          <p className="mt-3 text-sm italic text-forest/80">
            „{review.verdict}"
          </p>
          <p className="mt-3 text-sm font-semibold text-terracotta">
            {dict.reviews.readMore} →
          </p>
        </div>
        <ScoreBadge score={review.score} />
      </div>
    </Link>
  );
}
