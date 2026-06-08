import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { products, allCategories } from "@/data/catalog";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Search } from "lucide-react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  sort: fallback(z.enum(["featured", "bestselling", "price-asc", "price-desc", "rating", "newest"]), "featured").default("featured"),
  cat: fallback(z.string(), "").default(""),
  organic: fallback(z.boolean(), false).default(false),
  available: fallback(z.boolean(), false).default(false),
});

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Shop all groceries — FreshBasket Market" },
      { name: "description", content: "Browse the full FreshBasket catalog with smart filters by category, price, brand and dietary preference." },
      { property: "og:title", content: "Shop all — FreshBasket Market" },
      { property: "og:description", content: "Browse the full FreshBasket catalog." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [price, setPrice] = useState<[number, number]>([0, 20]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.cat) list = list.filter((p) => p.category === search.cat);
    if (search.organic) list = list.filter((p) => p.badges.includes("organic"));
    if (search.available) list = list.filter((p) => p.inStock);
    list = list.filter((p) => {
      const eff = p.salePrice ?? p.price;
      return eff >= price[0] && eff <= price[1];
    });
    switch (search.sort) {
      case "price-asc": list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)); break;
      case "price-desc": list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => Number(b.badges.includes("new")) - Number(a.badges.includes("new"))); break;
      case "bestselling": list.sort((a, b) => Number(b.badges.includes("bestseller")) - Number(a.badges.includes("bestseller"))); break;
    }
    return list;
  }, [search, price]);

  const setSort = (sort: string) => navigate({ search: (prev) => ({ ...prev, sort: sort as never }) });

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={search.cat === ""}
              onCheckedChange={() => navigate({ search: (p) => ({ ...p, cat: "" }) })}
            />
            All
          </label>
          {allCategories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={search.cat === c.slug}
                onCheckedChange={(v) =>
                  navigate({ search: (p) => ({ ...p, cat: v ? c.slug : "" }) })
                }
              />
              <span aria-hidden="true">{c.emoji}</span> {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Price</h3>
        <Slider value={price} onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])} min={0} max={20} step={1} />
        <p className="mt-1 text-xs text-muted-foreground">${price[0]} – ${price[1]}+</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Preferences</h3>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={search.organic}
            onCheckedChange={(v) => navigate({ search: (p) => ({ ...p, organic: !!v }) })}
          />
          Organic only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={search.available}
            onCheckedChange={(v) => navigate({ search: (p) => ({ ...p, available: !!v }) })}
          />
          In stock only
        </label>
      </div>
    </div>
  );

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <header>
        <h1 className="font-display text-3xl font-bold">Shop all groceries</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products available</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-xl border bg-card p-4">{filters}</div>
        </aside>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-4">{filters}</div>
              </SheetContent>
            </Sheet>
            <Label htmlFor="sort" className="sr-only">Sort</Label>
            <Select value={search.sort} onValueChange={setSort}>
              <SelectTrigger id="sort" className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="bestselling">Best selling</SelectItem>
                <SelectItem value="price-asc">Price: Low to high</SelectItem>
                <SelectItem value="price-desc">Price: High to low</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="h-10 w-10" />}
              title="No products match your filters"
              description="Try clearing some filters or browse all categories."
              action={
                <Button onClick={() => navigate({ search: { sort: "featured", cat: "", organic: false, available: false } })}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
