import { Star } from "lucide-react";

export function RatingStars({ rating, size = 14, showValue = false, reviewCount }: { rating: number; size?: number; showValue?: boolean; reviewCount?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-warning text-warning" : "fill-muted text-muted"}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {showValue && <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
