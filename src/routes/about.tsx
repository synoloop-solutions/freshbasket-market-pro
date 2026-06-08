import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FreshBasket Market — our story" },
      { name: "description", content: "FreshBasket Market connects local farms and trusted brands with families across the country." },
      { property: "og:title", content: "About FreshBasket Market" },
      { property: "og:description", content: "Connecting local farms with families." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container-page max-w-3xl space-y-6 py-10">
      <Breadcrumbs items={[{ label: "About" }]} />
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Our story</h1>
      <p className="text-base leading-relaxed text-muted-foreground">
        FreshBasket Market started with a simple idea: make groceries effortless for busy families
        without sacrificing freshness. Today, we partner with hundreds of local farms and trusted
        brands to deliver hand-picked produce, pantry staples, and household essentials to your
        door in as little as 60 minutes.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat n="500k+" label="Happy families" />
        <Stat n="200+" label="Cities served" />
        <Stat n="98%" label="On-time delivery" />
      </div>
      <h2 className="font-display text-2xl font-bold">What we stand for</h2>
      <ul className="space-y-2 text-sm">
        <li>· <strong>Fresh first.</strong> Every basket is hand-picked the day it ships.</li>
        <li>· <strong>Fair pricing.</strong> We negotiate hard so you don't have to.</li>
        <li>· <strong>People-powered.</strong> Our drivers are W-2 employees with benefits.</li>
        <li>· <strong>Sustainable.</strong> Recyclable packaging and route-optimized deliveries.</li>
      </ul>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 text-center">
      <p className="font-display text-3xl font-bold text-primary">{n}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
