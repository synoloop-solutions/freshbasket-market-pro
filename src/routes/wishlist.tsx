import { createFileRoute, Link } from "@tanstack/react-router";
import { useWishlist } from "@/stores";
import { products } from "@/data/catalog";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your wishlist — FreshBasket Market" },
      { name: "description", content: "Save your favourite items for later." },
      { property: "og:title", content: "Wishlist — FreshBasket" },
      { property: "og:description", content: "Your saved items." },
      { property: "og:url", content: "/wishlist" },
    ],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const slugs = useWishlist((s) => s.slugs);
  const items = products.filter((p) => slugs.includes(p.slug));

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="font-display text-3xl font-bold">Your wishlist</h1>
      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-10 w-10" />}
          title="No saved items yet"
          description="Tap the heart on any product to save it for later."
          action={<Button asChild><Link to="/shop">Browse the shop</Link></Button>}
        />
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
