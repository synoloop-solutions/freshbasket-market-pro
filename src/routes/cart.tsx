import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/stores";
import { products } from "@/data/catalog";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProductImage } from "@/components/shared/ProductImage";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Tag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — FreshBasket Market" },
      { name: "description", content: "Review your basket and check out securely." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQuantity, remove, subtotal, discount, deliveryFee, tax, total, promoCode, applyPromo } = useCart();
  const [code, setCode] = useState(promoCode ?? "");
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: "Cart" }]} />
        <div className="mt-6">
          <EmptyState
            icon={<ShoppingCart className="h-10 w-10" />}
            title="Your cart is empty"
            description="Start adding groceries to see them here."
            action={<Button asChild><Link to="/shop">Browse the shop</Link></Button>}
          />
        </div>
      </div>
    );
  }

  const applyCode = () => {
    const c = code.trim().toUpperCase();
    if (!c) return applyPromo(null);
    if (c === "FRESH10" || c === "FREESHIP") {
      applyPromo(c);
      toast.success(`Promo code "${c}" applied`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="font-display text-3xl font-bold">Your cart</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3" aria-label="Cart items">
          {items.map((i) => {
            const p = productMap[i.slug];
            if (!p) return null;
            const price = p.salePrice ?? p.price;
            return (
              <li key={i.slug} className="flex gap-4 rounded-xl border bg-card p-4">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="shrink-0">
                  <ProductImage src={p.image} emoji={p.emoji} hue={p.hue} alt={p.name} size="md" className="h-24 w-24 rounded-md" sizes="96px" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                      <Link to="/product/$slug" params={{ slug: p.slug }} className="text-sm font-medium hover:text-primary sm:text-base">
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{p.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold">{formatPrice(price * i.quantity)}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(price)} ea</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <QuantityStepper value={i.quantity} onChange={(n) => setQuantity(i.slug, n)} />
                    <Button variant="ghost" size="sm" onClick={() => remove(i.slug)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="space-y-4 rounded-xl border bg-card p-5">
            <h2 className="text-base font-semibold">Order summary</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal())} />
              {discount() > 0 && <Row label="Discount" value={`- ${formatPrice(discount())}`} valueClass="text-sale" />}
              <Row label="Delivery" value={deliveryFee() === 0 ? "Free" : formatPrice(deliveryFee())} />
              <Row label="Tax (est.)" value={formatPrice(tax())} />
              <div className="my-2 h-px bg-border" />
              <Row label="Total" value={formatPrice(total())} bold />
            </dl>

            <div>
              <label htmlFor="promo" className="mb-1 block text-xs font-medium">Promo code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="FRESH10" className="pl-9" />
                </div>
                <Button variant="outline" onClick={applyCode}>Apply</Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Try <code>FRESH10</code> or <code>FREESHIP</code></p>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link to="/checkout">Proceed to checkout</Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">Secure checkout · 256-bit SSL</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold = false, valueClass = "" }: { label: string; value: string; bold?: boolean; valueClass?: string }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold" : ""}`}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-foreground ${valueClass}`}>{value}</dd>
    </div>
  );
}
