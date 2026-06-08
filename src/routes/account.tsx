import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth, useOrders, useCart, useLists } from "@/stores";
import { products } from "@/data/catalog";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { RepeatIcon, MapPin, Package, User as UserIcon, ListChecks } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account — FreshBasket Market" },
      { name: "description", content: "Manage your profile, orders, addresses and shopping lists." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut, addresses } = useAuth();
  const orders = useOrders((s) => s.orders);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const lists = useLists((s) => s.lists);
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

  if (!user) {
    return (
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: "Account" }]} />
        <div className="mt-6">
          <EmptyState
            icon={<UserIcon className="h-10 w-10" />}
            title="Sign in to your account"
            description="Access your order history, addresses, and saved lists."
            action={
              <div className="flex gap-2">
                <Button asChild><Link to="/auth/login">Sign in</Link></Button>
                <Button asChild variant="outline"><Link to="/auth/register">Create account</Link></Button>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  const reorder = (orderId: string) => {
    const o = orders.find((x) => x.id === orderId);
    if (!o) return;
    let skipped = 0;
    o.items.forEach((i) => {
      const p = productMap[i.slug];
      if (p?.inStock) add(i.slug, i.quantity);
      else skipped++;
    });
    openCart();
    toast.success(`Reordered ${o.items.length - skipped} items${skipped ? ` (${skipped} skipped: out of stock)` : ""}`);
  };

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Account" }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => { signOut(); toast.success("Signed out"); }}>Sign out</Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4" /> Orders</TabsTrigger>
          <TabsTrigger value="lists"><ListChecks className="mr-2 h-4 w-4" /> Lists</TabsTrigger>
          <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4" /> Addresses</TabsTrigger>
          <TabsTrigger value="profile"><UserIcon className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-3 pt-4">
          {orders.length === 0 ? (
            <EmptyState title="No orders yet" description="Your past orders will show up here." action={<Button asChild><Link to="/shop">Start shopping</Link></Button>} />
          ) : (
            orders.map((o) => (
              <article key={o.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Order {o.id}</p>
                    <p className="text-sm font-semibold">{formatDate(o.placedAt)} · {formatPrice(o.total)}</p>
                    <p className="text-xs text-muted-foreground">{o.items.length} items</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{o.status.replace("-", " ")}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {o.items.slice(0, 5).map((i) => <span key={i.slug} className="rounded-full bg-muted px-2 py-0.5">{i.name}</span>)}
                  {o.items.length > 5 && <span className="text-muted-foreground">+{o.items.length - 5} more</span>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => reorder(o.id)}>
                    <RepeatIcon className="mr-2 h-4 w-4" /> Reorder previous basket
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/track-order" search={{ id: o.id }}>Track order</Link>
                  </Button>
                </div>
              </article>
            ))
          )}
        </TabsContent>

        <TabsContent value="lists" className="space-y-3 pt-4">
          <div className="flex justify-end">
            <Button asChild variant="outline" size="sm"><Link to="/lists">Manage all lists</Link></Button>
          </div>
          {lists.length === 0 ? (
            <EmptyState title="No saved lists" description="Create lists for your weekly grocery runs." />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {lists.map((l) => (
                <li key={l.id} className="rounded-xl border bg-card p-4">
                  <Link to="/lists/$id" params={{ id: l.id }} className="text-sm font-semibold hover:text-primary">{l.name}</Link>
                  <p className="text-xs text-muted-foreground">{l.productSlugs.length} items</p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="addresses" className="space-y-3 pt-4">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{a.label}{a.isDefault && <Badge className="ml-2">Default</Badge>}</p>
                  <p className="text-sm text-muted-foreground">{a.line1}, {a.city}, {a.state} {a.zip}</p>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="profile" className="space-y-3 pt-4">
          <ProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileForm() {
  const { user, signIn } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signIn(email, name);
        toast.success("Profile updated");
      }}
      className="max-w-md space-y-3 rounded-xl border bg-card p-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="p-name">Name</Label>
        <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="p-email">Email</Label>
        <Input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
