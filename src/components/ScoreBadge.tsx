export function ScoreBadge({
  score,
  size = "sm",
  variant = "forest",
}: {
  score: number;
  size?: "sm" | "lg";
  variant?: "forest" | "cream";
}) {
  const sizeClasses =
    size === "lg" ? "h-16 w-16 text-2xl" : "h-11 w-11 text-sm";
  const colorClasses =
    variant === "cream"
      ? "bg-cream text-forest ring-cream/50"
      : "bg-forest text-cream ring-forest/30";
  return (
    <span className={`relative inline-flex shrink-0 ${sizeClasses} -rotate-6`}>
      <span
        aria-hidden="true"
        className={`absolute inset-[-4px] rounded-full border border-dashed ${
          variant === "cream" ? "border-cream/60" : "border-terracotta/60"
        }`}
      />
      <span
        className={`${colorClasses} inline-flex h-full w-full items-center justify-center rounded-full font-bold font-display`}
      >
        {score}
      </span>
    </span>
  );
}
