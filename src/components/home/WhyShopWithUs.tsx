import { Clock, Leaf, ShieldCheck, RefreshCw } from "lucide-react";

const items = [
  { icon: Clock, title: "Same-day delivery", text: "Order by 2 PM for delivery today." },
  { icon: Leaf, title: "Fresh guaranteed", text: "Not perfect? We'll refund or replace it." },
  { icon: ShieldCheck, title: "Secure payments", text: "Bank-grade encryption on every order." },
  { icon: RefreshCw, title: "Easy returns", text: "Hassle-free returns within 7 days." },
];

export function WhyShopWithUs() {
  return (
    <section className="rounded-2xl border bg-card p-6 sm:p-8">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Why shop with FreshBasket</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Built around the things that matter most to busy households.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.title} className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <i.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{i.title}</h3>
              <p className="text-xs text-muted-foreground">{i.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
