interface Props {
  emoji: string;
  hue: number;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "text-4xl",
  md: "text-5xl",
  lg: "text-7xl",
  xl: "text-9xl",
};

export function ProductImage({ emoji, hue, alt, className = "", size = "md" }: Props) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 20%, oklch(0.95 0.08 ${hue}), oklch(0.88 0.12 ${hue}) 60%, oklch(0.82 0.14 ${hue}))`,
      }}
    >
      <span className={`drop-shadow-sm select-none ${sizeMap[size]}`} aria-hidden="true">
        {emoji}
      </span>
    </div>
  );
}
