import { useMemo } from "react";
import { ProductRail } from "@/components/shared/ProductGrid";
import { products, popular } from "@/data/catalog";
import { useRecentlyViewed, useRecentlyPurchased } from "@/stores";

export function CustomersAlsoBuy() {
  const viewed = useRecentlyViewed((s) => s.slugs);
  const purchased = useRecentlyPurchased((s) => s.slugs);

  const items = useMemo(() => {
    const map = Object.fromEntries(products.map((p) => [p.slug, p]));
    const seedSlugs = [...viewed, ...purchased];
    const seeded = seedSlugs.map((s) => map[s]).filter(Boolean);
    if (seeded.length >= 5) return seeded.slice(0, 8);
    // fall back to popular, deduped
    const popularList = popular();
    const merged = [...seeded];
    for (const p of popularList) {
      if (!merged.find((m) => m.slug === p.slug)) merged.push(p);
      if (merged.length >= 8) break;
    }
    return merged;
  }, [viewed, purchased]);

  return <ProductRail title="Customers also buy" subtitle="Inspired by your recent activity" products={items} />;
}
