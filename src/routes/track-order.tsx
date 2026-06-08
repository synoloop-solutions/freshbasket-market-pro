import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useOrders } from "@/stores";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Circle, MapPin, Package, Phone, Search, Truck, User } from "lucide-react";
import { formatDateTime, formatPrice } from "@/lib/format";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const schema = z.object({ id: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/track-order")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Track your order — FreshBasket Market" },
      { name: "description", content: "Track your FreshBasket delivery in real-time." },
      { property: "og:title", content: "Track your order" },
      { property: "og:description", content: "Track your FreshBasket delivery." },
      { property: "og:url", content: "/track-order" },
    ],
    links: [{ rel: "canonical", href: "/track-order" }],
  }),
  component: TrackPage,
});

const stages = ["received", "preparing", "packed", "out-for-delivery", "delivered"] as const;
const stageLabels: Record<typeof stages[number], string> = {
  received: "Order received",
  preparing: "Preparing your order",
  packed: "Packed & ready",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
};

function TrackPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const orders = useOrders((s) => s.orders);
  const [id, setId] = useState(search.id);
  const [email, setEmail] = useState("");

  const order = id ? orders.find((o) => o.id.toLowerCase() === id.toLowerCase()) : undefined;
  // Demo: simulate progress - new orders start at "received", show progress based on minutes since placed
  const stageIndex = (() => {
    if (!order) return 0;
    if (order.status === "delivered") return 4;
    const minutes = (Date.now() - new Date(order.placedAt).getTime()) / 60000;
    if (minutes > 60) return 4;
    if (minutes > 40) return 3;
    if (minutes > 20) return 2;
    if (minutes > 5) return 1;
    return 0;
  })();

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Track order" }]} />
      <header className="rounded-2xl bg-gradient-to-br from-primary-soft to-cream p-6 sm:p-10">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Track your order</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your order number or email to see live progress.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: { id } });
          }}
          className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <div>
            <Label htmlFor="order-id" className="sr-only">Order number</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="order-id" placeholder="Order number (e.g. FB-100245)" value={id} onChange={(e) => setId(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="order-email" className="sr-only">Email</Label>
            <Input id="order-email" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit">Track</Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">Try the seeded demo order: <button type="button" className="underline" onClick={() => { setId("FB-100245"); navigate({ search: { id: "FB-100245" } }); }}>FB-100245</button></p>
      </header>

      {search.id && !order && (
        <div className="rounded-xl border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">No order found for "{search.id}". Double-check the number and try again.</p>
        </div>
      )}

      {order && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Order</p>
                  <h2 className="font-display text-xl font-bold">{order.id}</h2>
                  <p className="text-xs text-muted-foreground">Placed {formatDateTime(order.placedAt)}</p>
                </div>
                <Badge stage={stages[stageIndex]} />
              </div>

              {/* Timeline */}
              <ol className="mt-6 space-y-4" aria-label="Delivery progress">
                {stages.map((s, i) => {
                  const done = i <= stageIndex;
                  const active = i === stageIndex;
                  return (
                    <li key={s} className="flex gap-3">
                      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 border-b pb-3">
                        <p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>
                          {stageLabels[s]} {active && <span className="ml-1 text-xs text-primary">· In progress</span>}
                        </p>
                        {i === 3 && active && (
                          <p className="text-xs text-muted-foreground">Your driver is on the way — estimated arrival in 12 minutes.</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-2xl border">
              <div
                className="relative aspect-[5/3] w-full"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, oklch(0.93 0.04 145), oklch(0.93 0.04 145) 12px, oklch(0.9 0.04 145) 12px, oklch(0.9 0.04 145) 24px)",
                }}
                role="img"
                aria-label="Map preview placeholder"
              >
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/95 p-3 shadow-md">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute bottom-4 right-4 rounded-md bg-background/95 px-3 py-1.5 text-xs font-semibold">
                  ETA: 12 min
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="text-sm font-semibold">Your driver</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground"><User className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm font-medium">Marcus W.</p>
                  <p className="text-xs text-muted-foreground">★ 4.95 · 1,240 deliveries</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                <Phone className="mr-2 h-4 w-4" /> Contact driver
              </Button>
            </div>

            <div className="rounded-2xl border bg-card p-5 text-sm">
              <h3 className="font-semibold">Delivery to</h3>
              <p className="mt-1 flex items-start gap-1.5 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{order.address ? `${order.address.line1}, ${order.address.city}, ${order.address.state} ${order.address.zip}` : "—"}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Slot: {order.slot ?? "—"}</p>
            </div>

            <div className="rounded-2xl border bg-card p-5">
              <h3 className="text-sm font-semibold">{order.items.length} items · {formatPrice(order.total)}</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {order.items.slice(0, 5).map((i) => (
                  <li key={i.slug}><Package className="mr-1 inline h-3 w-3" />{i.name} × {i.quantity}</li>
                ))}
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <Link to="/account">View in account</Link>
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Badge({ stage }: { stage: typeof stages[number] }) {
  const color = stage === "delivered" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {stageLabels[stage]}
    </span>
  );
}
