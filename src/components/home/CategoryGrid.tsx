import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";

export function CategoryGrid() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold sm:text-2xl">Shop by category</h2>
          <p className="text-sm text-muted-foreground">Everything you need, organized just the way you like it.</p>
        </div>
        <Link to="/shop" className="hidden text-sm font-medium text-primary hover:underline sm:inline">View all</Link>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="group flex flex-col items-center rounded-2xl border bg-card p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-4"
          >
            <div className="mb-2 h-16 w-16 overflow-hidden rounded-full ring-2 ring-background sm:h-20 sm:w-20">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                decoding="async"
                sizes="80px"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className="text-xs font-medium leading-tight sm:text-sm">{c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
