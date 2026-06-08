import { testimonials } from "@/data/reviews";
import { RatingStars } from "@/components/shared/RatingStars";
import { testimonialAvatars } from "@/data/images";

export function Testimonials() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Loved by 500,000+ shoppers</h2>
        <p className="mt-1 text-sm text-muted-foreground">Real reviews from real families.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="rounded-2xl border bg-card p-5 shadow-sm">
            <RatingStars rating={t.rating} />
            <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <img
                src={testimonialAvatars[t.name]}
                alt={t.name}
                loading="lazy"
                decoding="async"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-xs text-muted-foreground">
                <span className="block font-semibold text-foreground">{t.name}</span>
                {t.role}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
