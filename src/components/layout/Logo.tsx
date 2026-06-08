import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-display ${className}`} aria-label="FreshBasket Market — Home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Leaf className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        FreshBasket<span className="text-primary"> Market</span>
      </span>
    </Link>
  );
}
