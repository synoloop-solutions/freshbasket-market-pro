import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { DeliveryChecker } from "@/components/shared/DeliveryChecker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, MapPin, Truck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery — FreshBasket Market" },
      { name: "description", content: "Same-day grocery delivery in most cities. See delivery windows, fees, and FAQs." },
      { property: "og:title", content: "Delivery — FreshBasket Market" },
      { property: "og:description", content: "Same-day grocery delivery in most cities." },
      { property: "og:url", content: "/delivery" },
    ],
    links: [{ rel: "canonical", href: "/delivery" }],
  }),
  component: DeliveryPage,
});

const faqs = [
  { q: "How fast is same-day delivery?", a: "Order before 2 PM for same-day delivery. Express delivery brings your order in 60 minutes." },
  { q: "How much does delivery cost?", a: "Standard delivery is $4.99, free on orders over $35. Express delivery is $4.99 with no minimum." },
  { q: "Where do you deliver?", a: "We currently deliver to 200+ ZIP codes across major metro areas. Enter yours above to confirm." },
  { q: "What if I'm not home?", a: "Choose contact-free delivery and we'll leave your bags at the door." },
  { q: "How is freshness guaranteed?", a: "Every order is hand-picked by trained shoppers. Not fresh? We'll refund or replace it." },
];

export default function DeliveryPage() {
  return (
    <div className="container-page space-y-8 py-6">
      <Breadcrumbs items={[{ label: "Delivery" }]} />
      <header className="rounded-2xl bg-gradient-to-br from-primary-soft to-cream p-6 sm:p-10">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Same-day delivery, on your schedule</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Free over $35 · 60-minute express option · 100% fresh guarantee
        </p>
      </header>

      <DeliveryChecker />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Info icon={<Clock />} title="Same-day windows" body="Order before 2 PM for same-day. Choose 2-hour windows that fit your day." />
        <Info icon={<Truck />} title="Express in 60 min" body="Need it now? Express delivery for $4.99 in most areas." />
        <Info icon={<MapPin />} title="200+ cities" body="We're growing fast. Enter your ZIP to confirm coverage." />
        <Info icon={<ShieldCheck />} title="Fresh guarantee" body="Not 100% fresh? We refund or replace it — no questions." />
      </section>

      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold sm:text-2xl">Delivery fees</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="pb-2">Type</th>
              <th className="pb-2">Window</th>
              <th className="pb-2 text-right">Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr><td className="py-3">Standard</td><td>2-hour window</td><td className="text-right font-medium">$4.99 (free over $35)</td></tr>
            <tr><td className="py-3">Express</td><td>Within 60 minutes</td><td className="text-right font-medium">$4.99</td></tr>
            <tr><td className="py-3">Scheduled</td><td>Tomorrow & beyond</td><td className="text-right font-medium">Free</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Delivery FAQs</h2>
        <Accordion type="single" collapsible className="mt-4 rounded-2xl border bg-card">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-b-0">
              <AccordionTrigger className="px-4">{f.q}</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

function Info({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</div>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
