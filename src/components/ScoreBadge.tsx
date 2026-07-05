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
    size === "lg" ? "h-16 w-16 text-2xl" : "h-10 w-10 text-sm";
  const colorClasses =
    variant === "cream" ? "bg-cream text-forest" : "bg-forest text-cream";
  return (
    <span
      className={`${sizeClasses} ${colorClasses} inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold`}
    >
      {score}
    </span>
  );
}
