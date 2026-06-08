import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLists } from "@/stores";
import { products } from "@/data/catalog";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListPlus, ListChecks, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lists/")({
  head: () => ({
    meta: [
      { title: "Shopping lists — FreshBasket Market" },
      { name: "description", content: "Organize your recurring grocery runs with saved shopping lists." },
      { property: "og:title", content: "Shopping lists" },
      { property: "og:description", content: "Save and reorder your favourite baskets." },
      { property: "og:url", content: "/lists" },
    ],
    links: [{ rel: "canonical", href: "/lists" }],
  }),
  component: ListsPage,
});

function ListsPage() {
  const { lists, createList, deleteList } = useLists();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Shopping lists" }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Saved shopping lists</h1>
          <p className="text-sm text-muted-foreground">Organize your weekly essentials and reorder in one tap.</p>
        </div>
        <Button onClick={() => setOpen(true)}><ListPlus className="mr-2 h-4 w-4" /> New list</Button>
      </div>

      {lists.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-10 w-10" />}
          title="No lists yet"
          description="Create your first list to save items you buy regularly."
          action={<Button onClick={() => setOpen(true)}>Create a list</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((l) => {
            const preview = l.productSlugs.slice(0, 5).map((s) => productMap[s]).filter(Boolean);
            return (
              <article key={l.id} className="group flex flex-col rounded-2xl border bg-card p-5 transition hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/lists/$id" params={{ id: l.id }} className="text-lg font-semibold hover:text-primary">
                    {l.name}
                  </Link>
                  <button
                    onClick={() => { if (confirm(`Delete "${l.name}"?`)) { deleteList(l.id); toast.success("List deleted"); } }}
                    aria-label={`Delete ${l.name}`}
                    className="rounded p-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{l.productSlugs.length} items</p>
                <div className="mt-3 flex gap-1">
                  {preview.map((p) => (
                    <span key={p.slug} className="text-2xl" aria-hidden="true" title={p.name}>{p.emoji}</span>
                  ))}
                  {preview.length === 0 && <span className="text-xs text-muted-foreground">Empty list</span>}
                </div>
                <Button asChild variant="outline" size="sm" className="mt-4 self-start">
                  <Link to="/lists/$id" params={{ id: l.id }}>View list</Link>
                </Button>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create a new list</DialogTitle></DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              createList(name.trim());
              toast.success(`Created "${name}"`);
              setName("");
              setOpen(false);
            }}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="list-name">List name</Label>
              <Input id="list-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sunday meal prep" required maxLength={50} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
