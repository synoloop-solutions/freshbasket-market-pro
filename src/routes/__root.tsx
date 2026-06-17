import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild><Link to="/">Go home</Link></Button>
          <Button asChild variant="outline"><Link to="/shop">Browse shop</Link></Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={() => { router.invalidate(); reset(); }}>Try again</Button>
          <Button asChild variant="outline"><Link to="/">Go home</Link></Button>
        </div>
      </div>
    </div>
  );
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FreshBasket Market",
  url: "/",
  logo: "/favicon.ico",
  sameAs: ["https://facebook.com/freshbasket", "https://instagram.com/freshbasket"],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FreshBasket Market — Fresh groceries delivered same-day" },
      { name: "description", content: "Shop fresh produce, pantry essentials, dairy, meat and more. Free same-day delivery on orders over $35." },
      { name: "theme-color", content: "#3eaa6a" },
      { property: "og:title", content: "FreshBasket Market — Fresh groceries delivered same-day" },
      { property: "og:description", content: "Shop fresh produce, pantry essentials, dairy, meat and more. Free same-day delivery on orders over $35." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "FreshBasket Market" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FreshBasket Market — Fresh groceries delivered same-day" },
      { name: "twitter:description", content: "Shop fresh produce, pantry essentials, dairy, meat and more. Free same-day delivery on orders over $35." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/beb411a8-28ac-4b70-b798-ed937e3c399c/id-preview-00c22d49--a1064402-4daf-4f27-9726-b8be1b390134.lovable.app-1780953892359.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/beb411a8-28ac-4b70-b798-ed937e3c399c/id-preview-00c22d49--a1064402-4daf-4f27-9726-b8be1b390134.lovable.app-1780953892359.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationJsonLd) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-dvh flex-col">
        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>
        <Footer />
        <MobileBottomBar />
        <CartDrawer />
        <CookieBanner />
        <Toaster richColors position="top-right" />
      </div>
    </QueryClientProvider>
  );
}
