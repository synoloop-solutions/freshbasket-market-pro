import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { lifestyleImages } from "@/data/images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FreshBasket Market — our story" },
      { name: "description", content: "FreshBasket Market connects local farms and trusted brands with families across the country." },
      { property: "og:title", content: "About FreshBasket Market" },
      { property: "og:description", content: "Connecting local farms with families." },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: lifestyleImages.aboutStore },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container-page max-w-5xl space-y-10 py-10">
      <Breadcrumbs items={[{ label: "About" }]} />
      <header className="grid items-center gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Our story</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            FreshBasket Market started with a simple idea: make groceries effortless for busy
            families without sacrificing freshness. Today, we partner with hundreds of local farms
            and trusted brands to deliver hand-picked produce, pantry staples, and household
            essentials to your door in as little as 60 minutes.
          </p>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src={lifestyleImages.aboutStore}
            alt="Fresh produce displayed at an open-air market"
            loading="eager"
            decoding="async"
            sizes="(max-width:768px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat n="500k+" label="Happy families" />
        <Stat n="200+" label="Cities served" />
        <Stat n="98%" label="On-time delivery" />
      </div>
      <div className="grid items-center gap-6 md:grid-cols-2">
        <div className="order-2 aspect-[4/3] overflow-hidden rounded-2xl md:order-1">
          <img
            src={lifestyleImages.aboutTeam}
            alt="Grocer arranging fresh produce in the store"
            loading="lazy"
            decoding="async"
            sizes="(max-width:768px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="order-1 space-y-3 md:order-2">
          <h2 className="font-display text-2xl font-bold">What we stand for</h2>
          <ul className="space-y-2 text-sm">
            <li>· <strong>Fresh first.</strong> Every basket is hand-picked the day it ships.</li>
            <li>· <strong>Fair pricing.</strong> We negotiate hard so you don't have to.</li>
            <li>· <strong>People-powered.</strong> Our drivers are W-2 employees with benefits.</li>
            <li>· <strong>Sustainable.</strong> Recyclable packaging and route-optimized deliveries.</li>
          </ul>
        </div>
      </div>
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

