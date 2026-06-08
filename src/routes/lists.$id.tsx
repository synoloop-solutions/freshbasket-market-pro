import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLists, useCart } from "@/stores";
import { products } from "@/data/catalog";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductImage } from "@/components/shared/ProductImage";
import { ListChecks, ShoppingCart, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/lists/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Shopping list — FreshBasket Market` },
      { name: "description", content: "Your saved shopping list." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: `/lists/${params.id}` },
    ],
  }),
  notFoundComponent: () => (
    <div className="container-page py-16">
      <EmptyState title="List not found" description="This list may have been deleted." action={<Button asChild><Link to="/lists">All lists</Link></Button>} />
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-16">
      <EmptyState title="Something went wrong" description="Please try again." />
    </div>
  ),
  component: ListDetail,
});

function ListDetail() {
  const { id } = Route.useParams();
  const list = useLists((s) => s.lists.find((l) => l.id === id));
  const removeFromList = useLists((s) => s.removeFromList);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);

  if (!list) throw notFound();
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));
  const items = list.productSlugs.map((s) => productMap[s]).filter(Boolean);
  const inStockItems = items.filter((p) => p.inStock);

  const addAll = () => {
    let added = 0;
    let skipped = 0;
    inStockItems.forEach((p) => { add(p.slug, 1); added++; });
    skipped = items.length - inStockItems.length;
    openCart();
    toast.success(`Added ${added} items to cart${skipped ? ` (${skipped} out of stock, skipped)` : ""}`);
  };

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Shopping lists", to: "/lists" }, { label: list.name }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{list.name}</h1>
          <p className="text-sm text-muted-foreground">{items.length} items</p>
        </div>
        {items.length > 0 && (
          <Button onClick={addAll}><ShoppingCart className="mr-2 h-4 w-4" /> Add all to cart</Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-10 w-10" />}
          title="This list is empty"
          description="Add items from any product page to populate this list."
          action={<Button asChild><Link to="/shop">Browse shop</Link></Button>}
        />
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {items.map((p) => (
            <li key={p.slug} className="flex items-center gap-3 p-3 sm:p-4">
              <Link to="/product/$slug" params={{ slug: p.slug }} className="shrink-0">
                <ProductImage src={p.image} emoji={p.emoji} hue={p.hue} alt={p.name} size="sm" className="h-16 w-16 rounded-md" sizes="64px" />
              </Link>
              <div className="flex-1">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="text-sm font-medium hover:text-primary">{p.name}</Link>
                <p className="text-xs text-muted-foreground">{p.brand} · {p.unit}</p>
                {!p.inStock && <p className="text-xs font-medium text-destructive">Currently out of stock</p>}
              </div>
              <p className="hidden text-sm font-semibold sm:block">{formatPrice(p.salePrice ?? p.price)}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { removeFromList(list.id, p.slug); toast.success("Removed from list"); }}
                aria-label={`Remove ${p.name} from list`}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
