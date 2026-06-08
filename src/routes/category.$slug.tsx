import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory, categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/catalog";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { category: cat, products: getProductsByCategory(params.slug) };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.category.name ?? "Category";
    return {
      meta: [
        { title: `${name} — FreshBasket Market` },
        { name: "description", content: `Shop ${name.toLowerCase()} at FreshBasket Market. ${loaderData?.category.blurb ?? ""}` },
        { property: "og:title", content: `${name} — FreshBasket Market` },
        { property: "og:description", content: loaderData?.category.blurb ?? "" },
        { property: "og:url", content: `/category/${loaderData?.category.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${loaderData?.category.slug}` }],
      scripts: loaderData
        ? [{
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: "Shop", item: "/shop" },
                { "@type": "ListItem", position: 3, name: loaderData.category.name, item: `/category/${loaderData.category.slug}` },
              ],
            }),
          }]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-16">
      <EmptyState title="Category not found" description="The category you're looking for doesn't exist." />
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-16">
      <EmptyState title="Something went wrong" description="Please try again in a moment." />
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Shop", to: "/shop" }, { label: category.name }]} />
      <header className="relative overflow-hidden rounded-2xl">
        <img
          src={category.image}
          alt=""
          loading="eager"
          decoding="async"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-foreground/10" />
        <div className="relative p-6 text-background sm:p-10">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{category.name}</h1>
          <p className="mt-1 max-w-xl text-sm opacity-90 sm:text-base">{category.blurb}</p>
          <p className="mt-3 text-xs opacity-80">{products.length} products</p>
        </div>
      </header>

      {products.length === 0 ? (
        <EmptyState title="No products in this category yet" description="Check back soon — we restock daily." />
      ) : (
        <ProductGrid products={products} />
      )}

      <section className="pt-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Other categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.filter((c) => c.slug !== category.slug).map((c) => (
            <a key={c.slug} href={`/category/${c.slug}`} className="rounded-full border bg-card px-3 py-1.5 text-xs hover:bg-accent">
              <span aria-hidden="true">{c.emoji}</span> {c.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
