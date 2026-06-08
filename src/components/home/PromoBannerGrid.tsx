import { Link } from "@tanstack/react-router";
import { bannerImages } from "@/data/images";

interface Banner {
  title: string;
  sub: string;
  tag: string;
  image: string;
  cta: { to: string; params?: { slug: string }; label: string };
}

const banners: Banner[] = [
  {
    title: "Free Delivery Weekend",
    sub: "On every order — no minimum",
    tag: "Weekend deal",
    image: bannerImages.freeDelivery,
    cta: { to: "/shop", label: "Shop now" },
  },
  {
    title: "Buy One, Get One",
    sub: "On select pantry essentials",
    tag: "BOGO",
    image: bannerImages.bogo,
    cta: { to: "/category/$slug", params: { slug: "pantry" }, label: "Stock up" },
  },
  {
    title: "Family Savings",
    sub: "Save 15% on family-size packs",
    tag: "Big basket",
    image: bannerImages.family,
    cta: { to: "/category/$slug", params: { slug: "household" }, label: "Shop family" },
  },
];

export function PromoBannerGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {banners.map((b) => (
        <div
          key={b.title}
          className="group relative h-56 overflow-hidden rounded-2xl shadow-sm"
        >
          <img
            src={b.image}
            alt=""
            loading="lazy"
            decoding="async"
            sizes="(max-width:768px) 100vw, 33vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-foreground/75 via-foreground/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6 text-background">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">{b.tag}</span>
            <h3 className="mt-1 font-display text-xl font-bold">{b.title}</h3>
            <p className="text-sm opacity-90">{b.sub}</p>
            {b.cta.params ? (
              <Link
                to={b.cta.to}
                params={b.cta.params}
                className="mt-3 inline-flex items-center text-sm font-semibold underline"
              >
                {b.cta.label} →
              </Link>
            ) : (
              <Link to={b.cta.to} className="mt-3 inline-flex items-center text-sm font-semibold underline">
                {b.cta.label} →
              </Link>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
