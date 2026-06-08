import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useOrders } from "@/stores";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { CheckCircle2, Package, Truck } from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/order-confirmation/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.id} confirmed — FreshBasket Market` },
      { name: "description", content: "Thanks for your order!" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { id } = Route.useParams();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  if (!order) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Order not found"
          description="We couldn't find this order. Try the order tracker."
          action={<Button asChild><Link to="/track-order">Track an order</Link></Button>}
        />
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl space-y-6 py-10">
      <Breadcrumbs items={[{ label: "Order confirmed" }]} />
      <div className="rounded-2xl border bg-card p-6 text-center sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Thank you, your order is confirmed!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Order <strong className="text-foreground">{order.id}</strong> · placed {formatDateTime(order.placedAt)}
        </p>
        <p className="mt-2 text-sm">A receipt has been sent to <strong>{order.email}</strong>.</p>

        <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
          <Info icon={<Package />} title="Items" value={`${order.items.length} products`} />
          <Info icon={<Truck />} title="Delivery slot" value={order.slot ?? "—"} />
          <Info icon={<CheckCircle2 />} title="Total paid" value={formatPrice(order.total)} />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link to="/track-order" search={{ id: order.id }}>Track your order</Link>
          </Button>
          <Button asChild variant="outline"><Link to="/shop">Keep shopping</Link></Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-base font-semibold">Order details</h2>
        <ul className="mt-3 divide-y">
          {order.items.map((i) => (
            <li key={i.slug} className="flex justify-between gap-3 py-2 text-sm">
              <span>{i.name} × {i.quantity}</span>
              <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Info({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-cream p-3">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-semibold uppercase tracking-wide">{title}</span></div>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
