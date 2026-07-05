import Image from "next/image";
import Link from "next/link";
import { ScoreBadge } from "@/components/ScoreBadge";
import { TentPlaceholder } from "@/components/TentPlaceholder";
import type { Review } from "@/lib/content";
import { formatStayDate, getDictionary, reviewPath } from "@/lib/i18n";

export function ReviewCard({ review }: { review: Review }) {
  const dict = getDictionary(review.locale);
  return (
    <Link
      href={reviewPath(review.locale, review.slug)}
      className="group overflow-hidden rounded-[1.4rem] border border-forest/10 bg-white/70 shadow-forest/5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[0.4deg] hover:shadow-forest/15 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {review.cover ? (
          <Image
            src={review.cover}
            alt={review.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <TentPlaceholder />
        )}
        <span className="absolute top-3 right-3">
          <ScoreBadge score={review.score} />
        </span>
      </div>
      <div className="p-5">
        <p className="text-[0.68rem] text-moss uppercase tracking-[0.2em]">
          {review.location} · {formatStayDate(review.stayDate, review.locale)}
        </p>
        <h3 className="mt-1.5 font-display font-semibold text-forest-dark text-xl leading-snug">
          {review.title}
        </h3>
        <p className="mt-2 font-display text-[0.95rem] text-forest/75 italic leading-relaxed">
          „{review.verdict}“
        </p>
        <p className="mt-4 font-bold text-[0.8rem] text-terracotta uppercase tracking-widest">
          {dict.reviews.readMore}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            {" "}
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
