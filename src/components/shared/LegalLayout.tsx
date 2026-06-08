import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import type { ReactNode } from "react";

export function LegalLayout({ title, lastUpdated = "December 2025", children }: { title: string; lastUpdated?: string; children: ReactNode }) {
  return (
    <div className="container-page max-w-3xl space-y-6 py-10">
      <Breadcrumbs items={[{ label: title }]} />
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>
      <div className="prose prose-sm max-w-none space-y-4 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
