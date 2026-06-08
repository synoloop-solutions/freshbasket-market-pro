import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/catalog";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: ({ search }) => ({
    meta: [
      { title: `${search.q ? `Search: ${search.q}` : "Search"} — FreshBasket Market` },
      { name: "description", content: "Search for fresh groceries, brands and household essentials." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q);

  const term = search.q.toLowerCase().trim();
  const results = term
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      )
    : [];

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ search: { q } });
        }}
        className="flex gap-2"
        role="search"
      >
        <label htmlFor="search-input" className="sr-only">Search</label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search FreshBasket…"
            className="h-12 pl-9 text-base"
          />
        </div>
        <Button type="submit" size="lg">Search</Button>
      </form>

      {!term ? (
        <EmptyState
          icon={<Search className="h-10 w-10" />}
          title="Search FreshBasket"
          description="Find your favorites — try “bananas”, “coffee”, or “olive oil”."
        />
      ) : results.length === 0 ? (
        <EmptyState
          title={`No results for "${search.q}"`}
          description="Try a different search term or browse our categories."
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"} for “<strong>{search.q}</strong>”
          </p>
          <ProductGrid products={results} />
        </>
      )}
    </div>
  );
}
