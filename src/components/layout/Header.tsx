import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingCart, User, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart, useLocation, useWishlist } from "@/stores";
import { categories } from "@/data/categories";

export function Header() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartCount = useCart((s) => s.totalItems());
  const openCart = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.slugs.length);
  const zip = useLocation((s) => s.zip);

  // Close mobile menu on route change
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-3 lg:gap-6">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle><Logo /></SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Home</Link>
              <Link to="/shop" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Shop all</Link>
              <Link to="/delivery" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Delivery</Link>
              <Link to="/lists" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Shopping lists</Link>
              <Link to="/track-order" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Track order</Link>
              <Link to="/account" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Account</Link>
              <div className="my-2 h-px bg-border" />
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shop by category</p>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <span className="mr-2" aria-hidden="true">{c.emoji}</span>{c.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        {/* Location */}
        <Link
          to="/delivery"
          className="hidden items-center gap-1.5 rounded-md border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground lg:inline-flex"
          aria-label="Change delivery location"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Deliver to <span className="text-foreground">{zip}</span>
        </Link>

        {/* Search */}
        <form onSubmit={submitSearch} className="hidden flex-1 md:block">
          <label htmlFor="header-search" className="sr-only">Search products</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="header-search"
              type="search"
              placeholder="Search fresh produce, brands, recipes…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-accent"
            aria-label={`Wishlist, ${wishCount} item${wishCount === 1 ? "" : "s"}`}
          >
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-sale px-1 text-[10px] text-sale-foreground hover:bg-sale">
                {wishCount}
              </Badge>
            )}
          </Link>
          <Link
            to="/account"
            className="hidden h-10 w-10 place-items-center rounded-md hover:bg-accent sm:grid"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-accent"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground hover:bg-primary">
                {cartCount}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="container-page pb-3 md:hidden">
        <form onSubmit={submitSearch}>
          <label htmlFor="header-search-mobile" className="sr-only">Search products</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="header-search-mobile"
              type="search"
              placeholder="Search products…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
        </form>
      </div>

      {/* Category nav */}
      <nav aria-label="Categories" className="hidden border-t lg:block">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          <Link to="/shop" className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent">All</Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm hover:bg-accent"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              <span className="mr-1" aria-hidden="true">{c.emoji}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
