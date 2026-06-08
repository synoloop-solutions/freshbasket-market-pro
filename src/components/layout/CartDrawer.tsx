import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/stores";
import { products } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { ProductImage } from "@/components/shared/ProductImage";
import { EmptyState } from "@/components/shared/EmptyState";
import { ShoppingCart, Trash2 } from "lucide-react";

export function CartDrawer() {
  const { isOpen, close, items, setQuantity, remove, subtotal, deliveryFee, total } = useCart();
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

  return (
    <Sheet open={isOpen} onOpenChange={(v) => (v ? null : close())}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={<ShoppingCart className="h-10 w-10" />}
              title="Your cart is empty"
              description="Browse our fresh selection and start filling your basket."
              action={
                <Button asChild onClick={close}>
                  <Link to="/shop">Start shopping</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="-mx-6 flex-1 space-y-1 overflow-y-auto px-6">
              {items.map((i) => {
                const p = productMap[i.slug];
                if (!p) return null;
                const price = p.salePrice ?? p.price;
                return (
                  <div key={i.slug} className="flex gap-3 border-b py-3">
                    <Link to="/product/$slug" params={{ slug: p.slug }} onClick={close} className="shrink-0">
                      <ProductImage emoji={p.emoji} hue={p.hue} alt={p.name} size="sm" className="h-16 w-16 rounded-md" />
                    </Link>
                    <div className="flex flex-1 flex-col gap-1">
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={close}
                        className="text-sm font-medium leading-snug hover:text-primary"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{p.unit} · {formatPrice(price)}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <QuantityStepper value={i.quantity} onChange={(n) => setQuantity(i.slug, n)} />
                        <button
                          onClick={() => remove(i.slug)}
                          aria-label={`Remove ${p.name}`}
                          className="rounded p-2 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right text-sm font-semibold">
                      {formatPrice(price * i.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">
                    {deliveryFee() === 0 ? "Free" : formatPrice(deliveryFee())}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total())}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" asChild onClick={close}>
                    <Link to="/cart">View cart</Link>
                  </Button>
                  <Button asChild onClick={close}>
                    <Link to="/checkout">Checkout</Link>
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
