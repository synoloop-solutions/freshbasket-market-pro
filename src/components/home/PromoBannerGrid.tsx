import { Link } from "@tanstack/react-router";

const banners = [
  {
    title: "Free Delivery Weekend",
    sub: "On every order — no minimum",
    tag: "Weekend deal",
    hue: 148,
    cta: { to: "/shop", label: "Shop now" },
  },
  {
    title: "Buy One, Get One",
    sub: "On select pantry essentials",
    tag: "BOGO",
    hue: 38,
    cta: { to: "/category/$slug", params: { slug: "pantry" }, label: "Stock up" },
  },
  {
    title: "Family Savings",
    sub: "Save 15% on family-size packs",
    tag: "Big basket",
    hue: 200,
    cta: { to: "/category/$slug", params: { slug: "household" }, label: "Shop family" },
  },
];

export function PromoBannerGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {banners.map((b) => (
        <div
          key={b.title}
          className="relative overflow-hidden rounded-2xl p-6 text-foreground shadow-sm"
          style={{
            background: `linear-gradient(135deg, oklch(0.94 0.08 ${b.hue}), oklch(0.86 0.14 ${b.hue}))`,
          }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{b.tag}</span>
          <h3 className="mt-1 font-display text-xl font-bold">{b.title}</h3>
          <p className="text-sm opacity-80">{b.sub}</p>
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
      ))}
    </section>
  );
}
