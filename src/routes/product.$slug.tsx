import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getProduct, getProductsByCategory, products } from "@/data/catalog";
import { getCategory } from "@/data/categories";
import { reviewsFor } from "@/data/reviews";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProductImage } from "@/components/shared/ProductImage";
import { RatingStars } from "@/components/shared/RatingStars";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { NotifyMeDialog } from "@/components/shared/NotifyMeDialog";
import { AddToListMenu } from "@/components/shared/AddToListMenu";
import { ProductRail } from "@/components/shared/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, BellRing, Truck, ShieldCheck, RefreshCw, MapPin } from "lucide-react";
import { useCart, useWishlist, useRecentlyViewed } from "@/stores";
import { formatPrice, formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product — FreshBasket Market" }] };
    return {
      meta: [
        { title: `${p.name} — FreshBasket Market` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — FreshBasket Market` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${p.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            brand: { "@type": "Brand", name: p.brand },
            description: p.description,
            aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.toFixed(1), reviewCount: p.reviewCount },
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: (p.salePrice ?? p.price).toFixed(2),
              availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-16">
      <EmptyState
        title="Product not found"
        description="This product may have been removed or the link is incorrect."
        action={<Button asChild><Link to="/shop">Back to shop</Link></Button>}
      />
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-16">
      <EmptyState title="Something went wrong" description="Please try again." />
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const toggleWish = useWishlist((s) => s.toggle);
  const inWish = useWishlist((s) => s.slugs.includes(product.slug));
  const pushView = useRecentlyViewed((s) => s.push);

  useEffect(() => { pushView(product.slug); }, [product.slug, pushView]);

  const cat = getCategory(product.category);
  const related = getProductsByCategory(product.category).filter((p) => p.slug !== product.slug).slice(0, 8);
  const frequently = products.filter((p) => p.badges.includes("bestseller") && p.slug !== product.slug).slice(0, 6);
  const reviews = reviewsFor(product.slug);
  const price = product.salePrice ?? product.price;
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <div className="container-page space-y-10 py-6">
      <Breadcrumbs items={[
        { label: "Shop", to: "/shop" },
        { label: cat?.name ?? "Category", to: cat ? "/category/$slug" : undefined, params: cat ? { slug: cat.slug } : undefined },
        { label: product.name },
      ]} />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-card">
            <ProductImage emoji={product.emoji} hue={product.hue} alt={product.name} className="absolute inset-0" size="xl" />
            {discount > 0 && (
              <Badge className="absolute left-3 top-3 bg-sale text-sale-foreground">-{discount}%</Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 grid place-items-center bg-background/70">
                <Badge variant="secondary" className="text-base">Out of Stock</Badge>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[product.hue, product.hue + 20, product.hue - 20, product.hue + 40].map((h, i) => (
              <button key={i} className="aspect-square overflow-hidden rounded-md border bg-card" aria-label={`View image ${i + 1}`}>
                <ProductImage emoji={product.emoji} hue={h} alt="" size="sm" className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
            <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <RatingStars rating={product.rating} showValue reviewCount={product.reviewCount} />
              <span className="text-xs text-muted-foreground">· {product.unit}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">{formatPrice(price)}</span>
            {product.salePrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
            {discount > 0 && <Badge className="bg-sale text-sale-foreground">Save {discount}%</Badge>}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.badges.map((b: string) => (
              <Badge key={b} variant="outline" className="capitalize">{b.replace("-", " ")}</Badge>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="rounded-lg border bg-card p-3 text-sm">
            <p className={`font-medium ${product.inStock ? "text-success" : "text-destructive"}`}>
              {product.inStock ? "✓ In stock" : "✗ Currently out of stock"}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> Deliver to your area today — order before 2 PM
            </p>
          </div>

          {product.inStock ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <QuantityStepper value={qty} onChange={setQty} />
              <Button
                size="lg"
                className="gap-2"
                onClick={() => {
                  add(product.slug, qty);
                  openCart();
                  toast.success(`${product.name} added to cart`);
                }}
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </Button>
              <Button variant="outline" size="lg" onClick={() => { toggleWish(product.slug); toast.success(inWish ? "Removed from wishlist" : "Added to wishlist"); }}>
                <Heart className={`h-4 w-4 ${inWish ? "fill-sale text-sale" : ""}`} />
              </Button>
              <AddToListMenu slug={product.slug} />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" variant="outline" onClick={() => setNotifyOpen(true)} className="gap-2">
                <BellRing className="h-4 w-4" /> Notify me when available
              </Button>
              <Button size="lg" variant="ghost" onClick={() => { toggleWish(product.slug); toast.success(inWish ? "Removed from wishlist" : "Added to wishlist"); }}>
                <Heart className={`h-4 w-4 ${inWish ? "fill-sale text-sale" : ""}`} />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-3 text-xs">
            <Trust icon={<Truck className="h-4 w-4" />} title="Free over $35" />
            <Trust icon={<ShieldCheck className="h-4 w-4" />} title="Fresh guarantee" />
            <Trust icon={<RefreshCw className="h-4 w-4" />} title="Easy returns" />
          </div>
        </div>
      </div>

      {/* Details tabs */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-3 pt-4 text-sm">
          <Row label="Ingredients" value={product.ingredients} />
          <Row label="Storage" value={product.storage} />
          <Row label="Allergens" value={product.allergens} />
          <Row label="Country of origin" value={product.origin} />
        </TabsContent>
        <TabsContent value="nutrition" className="pt-4 text-sm">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Calories" value={product.nutrition.calories} />
            <Stat label="Protein" value={`${product.nutrition.protein}g`} />
            <Stat label="Carbs" value={`${product.nutrition.carbs}g`} />
            <Stat label="Fat" value={`${product.nutrition.fat}g`} />
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-3 pt-4">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{r.title}</p>
                <RatingStars rating={r.rating} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.author} · {formatDate(r.date)}</p>
              <p className="mt-2 text-sm text-foreground">{r.body}</p>
            </article>
          ))}
        </TabsContent>
      </Tabs>

      {frequently.length > 0 && (
        <ProductRail title="Frequently bought together" products={frequently} />
      )}
      {related.length > 0 && (
        <ProductRail title="Similar products" subtitle={`More from ${cat?.name ?? "this category"}`} products={related} />
      )}

      <NotifyMeDialog open={notifyOpen} onOpenChange={setNotifyOpen} product={product} />
    </div>
  );
}

function Trust({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-card p-2">
      <span className="text-primary">{icon}</span>
      <span className="font-medium">{title}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b py-2 sm:grid-cols-[180px_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
