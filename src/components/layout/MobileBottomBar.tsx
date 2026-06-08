import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/stores";

export function MobileBottomBar() {
  const cartCount = useCart((s) => s.totalItems());
  const openCart = useCart((s) => s.open);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-background/95 backdrop-blur lg:hidden"
    >
      <Link to="/" className="flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
        <Home className="h-5 w-5" /> Home
      </Link>
      <Link to="/shop" className="flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }}>
        <LayoutGrid className="h-5 w-5" /> Shop
      </Link>
      <button
        type="button"
        onClick={openCart}
        className="relative flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        aria-label={`Cart, ${cartCount} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute right-6 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {cartCount}
          </span>
        )}
        Cart
      </button>
      <Link to="/account" className="flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }}>
        <User className="h-5 w-5" /> Account
      </Link>
    </nav>
  );
}
