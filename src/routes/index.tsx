import { Link } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductRail } from "@/components/shared/ProductGrid";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { PromoBannerGrid } from "@/components/home/PromoBannerGrid";
import { WhyShopWithUs } from "@/components/home/WhyShopWithUs";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { CustomersAlsoBuy } from "@/components/home/CustomersAlsoBuy";
import { trending, bestsellers, newArrivals, onSale } from "@/data/catalog";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshBasket Market — Fresh groceries delivered same-day" },
      { name: "description", content: "Shop fresh produce, pantry essentials, dairy, meat and more. Free same-day delivery on orders over $35." },
      { property: "og:title", content: "FreshBasket Market — Fresh groceries delivered same-day" },
      { property: "og:description", content: "Shop fresh produce, pantry essentials, dairy, meat and more. Free same-day delivery on orders over $35." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <div className="container-page space-y-12 py-10 sm:space-y-16 sm:py-14">
        <CategoryGrid />

        <ProductRail
          title="Today's deals"
          subtitle="Limited-time savings on top picks"
          products={onSale()}
          action={<CountdownTimer hours={8} />}
        />

        <ProductRail
          title="Trending this week"
          subtitle="What everyone's adding to their basket"
          products={trending()}
          action={<Link to="/shop" className="text-sm font-medium text-primary hover:underline">See all</Link>}
        />

        <ProductRail
          title="Best sellers"
          subtitle="Customer favourites, year after year"
          products={bestsellers()}
        />

        <PromoBannerGrid />

        <ProductRail
          title="Fresh arrivals"
          subtitle="New on our shelves this week"
          products={newArrivals()}
        />

        <CustomersAlsoBuy />

        <WhyShopWithUs />
        <Testimonials />
        <Newsletter />
      </div>
    </>
  );
}
