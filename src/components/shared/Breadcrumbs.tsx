import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <li>
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home size={14} aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight size={14} aria-hidden="true" />
            {c.to && i < items.length - 1 ? (
              <Link to={c.to as string} params={c.params as never} className="hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground" aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
