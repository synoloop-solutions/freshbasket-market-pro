# FreshBasket Market — Build Plan (v2)

A production-quality grocery & food delivery storefront with full shopping flow, mock data, and localStorage persistence. No backend required.

## Stack & approach

- **Stack**: TanStack Start + React + TypeScript + Tailwind v4 + shadcn/ui + Framer Motion (already configured).
- **Data**: Mock catalog in `src/data/`. Cart, wishlist, recently viewed, recently purchased, saved lists, cookie prefs, mock orders, notify-me subscriptions persisted in `localStorage` via Zustand stores.
- **No auth backend**: Login/Register/Reset are UI-only with a mock localStorage session.
- **Images**: Generated grocery imagery for hero, categories, and curated hero products; remaining products reuse category imagery to keep build time reasonable.

## Design system

- Palette: Fresh green primary, soft cream surface, white base, earthy neutrals, warm accent for promos/sale (all `oklch` tokens).
- Typography: Inter (body) + a friendly display face, loaded via `<link>` in `__root.tsx`.
- Tokens in `src/styles.css` under `@theme` + `@theme inline` for shadcn mapping. Medium radius, generous spacing, soft shadows.
- Motion: subtle fade/scale on cards, cart drawer slide, hover lift. Respects `prefers-reduced-motion`.

## Routes (file-based, per-route `head()` metadata)

```
/                          Home
/category/$slug            Category listing
/shop                      Full catalog with filters
/product/$slug             Product detail
/search                    Search results
/cart                      Cart page
/checkout                  Multi-step checkout (internal step state)
/order-confirmation/$id    Confirmation
/track-order               Order lookup + timeline
/wishlist                  Wishlist
/lists                     Saved Shopping Lists index
/lists/$id                 Saved list detail
/account                   Dashboard (profile, orders, addresses, settings, lists)
/auth/login | register | reset-password
/delivery                  Delivery info + availability checker
/about | /contact | /faq
/legal/privacy | terms | cookies | returns | delivery-policy
/sitemap.xml               Dynamic server route
```

`__root.tsx` holds Header, Footer, CartDrawer, CookieBanner, Toaster, single `<main>` with `<Outlet />`.

## Homepage sections (in order)

1. Hero (promo banner, seasonal offer, Shop Now CTA, delivery promise)
2. Delivery Availability Checker (ZIP input → always returns "Same-day delivery available")
3. Featured Categories grid
4. Today's Deals (countdown timer, sale badges)
5. **Trending This Week** (new)
6. Best Sellers
7. Promotional Banners (Free Delivery / Weekend Deals / BOGO / Family Savings)
8. Fresh Arrivals
9. **Customers Also Buy** (new — driven by recently viewed/purchased, falls back to popular)
10. Why Shop With Us (Same-Day Delivery, Fresh Guaranteed, Secure Payments, Easy Returns)
11. Customer Reviews / Testimonials
12. Newsletter

## New features (this revision)

- **Trending This Week**: section on home, sourced from mock `trendingSlugs` list, ProductCard rail with "Trending" badge.
- **Customers Also Buy**: home rail + product-detail rail; logic = recently viewed → recently purchased → popular fallback.
- **Delivery Availability Checker**: reusable component on home hero area and `/delivery` page. ZIP input + button → toast + inline success card: "Great news! Same-day delivery is available in your area." Stores last-checked ZIP in localStorage.
- **Saved Shopping Lists**: `/lists` index (seeded with Weekly Essentials, Breakfast Items, Family Shopping List). Create/rename/delete lists, add products from product card/detail menu, `/lists/$id` shows items with "Add all to cart". Tab in Account.
- **Smart Reorder**: Account → Orders. Each past order has "Reorder Previous Basket" → loads items into cart (skips out-of-stock with toast).
- **Out-of-Stock Handling**: ProductCard + Product Detail show "Out of Stock" badge, disable Add to Cart, surface "Notify Me" button → modal collects email, stores subscription in localStorage, success toast.
- **Recently Purchased**: tracked on checkout completion; powers Customers Also Buy and an Account → Orders quick-reorder rail.

## Components

- **Layout**: AnnouncementBar, Header (logo, LocationSelector, search, nav, wishlist/cart/account, mobile drawer), MegaMenu, Footer, MobileBottomBar (sticky cart + quick search).
- **Product**: ProductCard (with stock states + badges), ProductGrid, ProductGallery (zoom), QuantityStepper, PriceBlock, RatingStars, Badge, FilterSidebar, MobileFilterDrawer, SortSelect, Pagination, EmptyState, NotifyMeDialog, AddToListMenu.
- **Cart/Checkout**: CartDrawer, CartLineItem, OrderSummary, PromoCodeInput, CheckoutStepper, AddressForm, DeliverySlotPicker, PaymentForm (mock), TrustBadges.
- **Home sections**: Hero, DeliveryChecker, CategoryGrid, DealsRail + CountdownTimer, TrendingRail, BestSellers, PromoBannerGrid, FreshArrivals, CustomersAlsoBuy, WhyShopWithUs, Testimonials, Newsletter.
- **Lists**: ListsIndex, ListCard, ListDetail.
- **Account**: AccountShell (tabs), OrderHistoryList, OrderRow with ReorderButton, AddressBook, ProfileForm.
- **Order tracking**: OrderTimeline (5 stages), DriverCard, MapPlaceholder.
- **Trust/UX**: CookieBanner + PreferencesModal, RecentlyViewedRail, Breadcrumbs, Skeletons for loading states.

## State (Zustand + localStorage)

`cartStore`, `wishlistStore`, `recentlyViewedStore`, `recentlyPurchasedStore`, `savedListsStore`, `notifyMeStore`, `locationStore`, `cookieConsentStore`, `mockAuthStore`, `mockOrdersStore`.

## Mock data

- ~11 categories × ~8–12 products (~100). Fields: name, brand, price, salePrice, unit, rating, reviewCount, badges, dietary tags, organic, **stock (incl. some out-of-stock)**, images, description, ingredients, nutrition, storage, allergens, origin.
- Reviews, promo codes (`FRESH10`, `FREESHIP`), delivery slots, testimonials, seeded saved lists, seeded past orders for reorder demo.

## SEO

- Per-route `title`, `description`, `og:title/description`, `og:url`; canonical on leaves only.
- JSON-LD: Organization (root), Product on `/product/$slug` (incl. `availability`), BreadcrumbList on category/product, FAQPage on `/faq`.
- Dynamic `/sitemap.xml` enumerating static + product + category routes; `public/robots.txt` with `Allow: /`.
- Semantic HTML, single `<main>`, proper heading order.

## Accessibility (target 95+)

- Labeled icon buttons, keyboard-navigable menus via shadcn/Radix, visible focus rings, token-based contrast, `aria-live` for cart/notify updates, 44×44 tap targets, `h-dvh` for full-height layouts, alt text on all imagery.

## Performance (target 90+)

- Lazy-load below-the-fold images, `aspect-*` wrappers (no CLS), `loading="lazy"` + `decoding="async"`, preload LCP hero image via route `head().links`, route-level code splitting, font `display=swap` with preconnect, skeleton loaders to avoid jank.

## Audit pass (post-build)

After the build, sweep for and fix:
- Broken layouts at 320 / 768 / 1024 / 1440 widths.
- Inconsistent spacing — normalize to the token scale.
- Mobile UX — sticky cart bar, thumb-reachable CTAs, drawer filters.
- A11y violations — run mental WCAG checklist; verify focus, labels, contrast.
- Missing metadata — every route has unique title + description.
- SEO weaknesses — H1 per page, internal links, JSON-LD validity.
- Empty states — cart, wishlist, lists, search, orders, no-results filters.
- Loading states — skeletons on data-driven rails.
- Visual hierarchy — heading sizes, CTA prominence, price emphasis.
- Conversion bottlenecks — trust badges near CTAs, free-shipping threshold nudge, urgency on deals, easy reorder.

Then trigger an SEO scan and surface the results panel.

## Lighthouse targets

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## Out of scope (mock only)

Real payments, real auth, real geolocation, real maps (placeholder), real email signup (toast only).

## Build order

1. Tokens, fonts, root layout, header/footer, cookie banner.
2. Mock data + Zustand stores (incl. lists, notify-me, recently purchased).
3. Home page with all sections + delivery checker + generated imagery.
4. Catalog, category, product detail (with out-of-stock + notify-me + add-to-list).
5. Cart drawer + cart page + checkout + confirmation (writes recently purchased + mock order).
6. Order tracking, wishlist, saved lists, search.
7. Account area incl. reorder; auth UI.
8. Delivery, about, contact, FAQ, legal pages.
9. Sitemap, robots, JSON-LD, SEO + a11y + responsive audit pass.
