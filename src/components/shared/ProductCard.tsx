import { Link } from "@tanstack/react-router";
import { Heart, Plus, BellRing } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { Product } from "@/data/catalog";
import { ProductImage } from "./ProductImage";
import { RatingStars } from "./RatingStars";
import { useCart, useWishlist } from "@/stores";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { NotifyMeDialog } from "./NotifyMeDialog";
import { cn } from "@/lib/utils";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const toggleWish = useWishlist((s) => s.toggle);
  const inWish = useWishlist((s) => s.slugs.includes(product.slug));
  const [notifyOpen, setNotifyOpen] = useState(false);

  const discountPct =
    product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md",
        compact && "rounded-lg",
      )}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block focus-visible:outline-none"
        aria-label={`${product.name} by ${product.brand}, ${formatPrice(product.salePrice ?? product.price)}`}
      >
        <div className="relative aspect-square">
          <ProductImage src={product.image} emoji={product.emoji} hue={product.hue} alt={product.name} className="absolute inset-0" size={compact ? "md" : "lg"} sizes={compact ? "176px" : "(max-width:640px) 50vw, (max-width:1024px) 33vw, 240px"} />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discountPct > 0 && (
              <Badge className="bg-sale text-sale-foreground hover:bg-sale">-{discountPct}%</Badge>
            )}
            {product.badges.includes("organic") && (
              <Badge variant="outline" className="border-success bg-background text-success">Organic</Badge>
            )}
            {product.badges.includes("new") && (
              <Badge variant="outline" className="border-primary bg-background text-primary">New</Badge>
            )}
            {product.badges.includes("trending") && !discountPct && (
              <Badge variant="outline" className="border-warning bg-background text-warning-foreground">Trending</Badge>
            )}
            {product.badges.includes("bogo") && (
              <Badge className="bg-warning text-warning-foreground">BOGO</Badge>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
              <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 text-sm font-medium leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.unit}</p>
        <div className="mt-1">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {product.salePrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-semibold text-sale">{formatPrice(product.salePrice)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-base font-semibold text-foreground">{formatPrice(product.price)}</span>
            )}
          </div>
          {product.inStock ? (
            <Button
              size="sm"
              className="h-9 gap-1 px-3"
              onClick={() => {
                add(product.slug, 1);
                openCart();
                toast.success(`${product.name} added to cart`);
              }}
            >
              <Plus size={16} /> Add
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-1 px-3"
              onClick={() => setNotifyOpen(true)}
            >
              <BellRing size={14} /> Notify
            </Button>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          toggleWish(product.slug);
          toast.success(inWish ? "Removed from wishlist" : "Added to wishlist");
        }}
        className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition-colors hover:bg-background"
        aria-label={inWish ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      >
        <Heart size={16} className={inWish ? "fill-sale text-sale" : "text-foreground"} />
      </button>

      <NotifyMeDialog open={notifyOpen} onOpenChange={setNotifyOpen} product={product} />
    </article>
  );
}
