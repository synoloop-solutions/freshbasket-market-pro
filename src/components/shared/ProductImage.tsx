import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  alt: string;
  /** Fallback emoji shown if the image fails to load. */
  emoji?: string;
  /** Fallback hue (0-360) for the placeholder background. */
  hue?: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** Set true for above-the-fold imagery (e.g. hero product). */
  eager?: boolean;
  /** Responsive sizes attribute. */
  sizes?: string;
}

const sizeMap = {
  sm: "text-4xl",
  md: "text-5xl",
  lg: "text-7xl",
  xl: "text-9xl",
};

export function ProductImage({
  src,
  alt,
  emoji,
  hue = 130,
  className = "",
  size = "md",
  eager = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
}: Props) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("flex items-center justify-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(circle at 30% 20%, oklch(0.95 0.08 ${hue}), oklch(0.88 0.12 ${hue}) 60%, oklch(0.82 0.14 ${hue}))`,
      }}
    >
      <span className={`drop-shadow-sm select-none ${sizeMap[size]}`} aria-hidden="true">
        {emoji ?? "🛒"}
      </span>
    </div>
  );
}
