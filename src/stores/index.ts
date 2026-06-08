import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products, type Product } from "@/data/catalog";
import { seededLists, seededOrders, seededAddresses } from "@/data/seed";

// ---------- Cart ----------
export interface CartItem {
  slug: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (slug: string, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  applyPromo: (code: string | null) => void;
  totalItems: () => number;
  subtotal: () => number;
  discount: () => number;
  deliveryFee: () => number;
  tax: () => number;
  total: () => number;
}

const productMap = () => Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (slug, quantity = 1) => {
        const map = productMap();
        if (!map[slug] || !map[slug].inStock) return;
        set((s) => {
          const existing = s.items.find((i) => i.slug === slug);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...s.items, { slug, quantity }] };
        });
      },
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQuantity: (slug, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.slug !== slug)
              : s.items.map((i) => (i.slug === slug ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [], promoCode: null }),
      applyPromo: (code) => set({ promoCode: code }),
      totalItems: () => get().items.reduce((a, i) => a + i.quantity, 0),
      subtotal: () => {
        const map = productMap();
        return get().items.reduce((a, i) => {
          const p = map[i.slug];
          if (!p) return a;
          return a + (p.salePrice ?? p.price) * i.quantity;
        }, 0);
      },
      discount: () => {
        const code = get().promoCode;
        const sub = get().subtotal();
        if (code === "FRESH10") return sub * 0.1;
        return 0;
      },
      deliveryFee: () => {
        const sub = get().subtotal() - get().discount();
        if (get().promoCode === "FREESHIP") return 0;
        if (sub === 0) return 0;
        return sub >= 35 ? 0 : 4.99;
      },
      tax: () => (get().subtotal() - get().discount()) * 0.0825,
      total: () => {
        const sub = get().subtotal() - get().discount();
        return sub + get().deliveryFee() + get().tax();
      },
    }),
    { name: "fb-cart" },
  ),
);

// ---------- Wishlist ----------
interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
}
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) =>
        set((s) => ({
          slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug],
        })),
      has: (slug) => get().slugs.includes(slug),
      remove: (slug) => set((s) => ({ slugs: s.slugs.filter((x) => x !== slug) })),
      clear: () => set({ slugs: [] }),
    }),
    { name: "fb-wishlist" },
  ),
);

// ---------- Recently viewed ----------
interface RecentState {
  slugs: string[];
  push: (slug: string) => void;
}
export const useRecentlyViewed = create<RecentState>()(
  persist(
    (set) => ({
      slugs: [],
      push: (slug) =>
        set((s) => ({
          slugs: [slug, ...s.slugs.filter((x) => x !== slug)].slice(0, 12),
        })),
    }),
    { name: "fb-recent" },
  ),
);

// ---------- Recently purchased ----------
interface PurchasedState {
  slugs: string[];
  addMany: (slugs: string[]) => void;
}
export const useRecentlyPurchased = create<PurchasedState>()(
  persist(
    (set) => ({
      slugs: [],
      addMany: (slugs) =>
        set((s) => ({ slugs: [...new Set([...slugs, ...s.slugs])].slice(0, 20) })),
    }),
    { name: "fb-purchased" },
  ),
);

// ---------- Saved Lists ----------
export interface SavedList {
  id: string;
  name: string;
  productSlugs: string[];
  createdAt: string;
}
interface ListsState {
  lists: SavedList[];
  createList: (name: string) => string;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  addToList: (id: string, slug: string) => void;
  removeFromList: (id: string, slug: string) => void;
}
export const useLists = create<ListsState>()(
  persist(
    (set) => ({
      lists: seededLists,
      createList: (name) => {
        const id = `list-${Date.now()}`;
        set((s) => ({
          lists: [...s.lists, { id, name, productSlugs: [], createdAt: new Date().toISOString() }],
        }));
        return id;
      },
      renameList: (id, name) =>
        set((s) => ({ lists: s.lists.map((l) => (l.id === id ? { ...l, name } : l)) })),
      deleteList: (id) => set((s) => ({ lists: s.lists.filter((l) => l.id !== id) })),
      addToList: (id, slug) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === id && !l.productSlugs.includes(slug)
              ? { ...l, productSlugs: [...l.productSlugs, slug] }
              : l,
          ),
        })),
      removeFromList: (id, slug) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === id ? { ...l, productSlugs: l.productSlugs.filter((x) => x !== slug) } : l,
          ),
        })),
    }),
    { name: "fb-lists" },
  ),
);

// ---------- Notify Me ----------
interface NotifyState {
  subscriptions: { slug: string; email: string }[];
  subscribe: (slug: string, email: string) => void;
}
export const useNotify = create<NotifyState>()(
  persist(
    (set) => ({
      subscriptions: [],
      subscribe: (slug, email) =>
        set((s) => ({ subscriptions: [...s.subscriptions, { slug, email }] })),
    }),
    { name: "fb-notify" },
  ),
);

// ---------- Mock orders ----------
export interface OrderItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
}
export interface MockOrder {
  id: string;
  placedAt: string;
  status: "received" | "preparing" | "packed" | "out-for-delivery" | "delivered";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  address?: { line1: string; city: string; state: string; zip: string };
  slot?: string;
  email?: string;
}
interface OrdersState {
  orders: MockOrder[];
  add: (order: MockOrder) => void;
  getById: (id: string) => MockOrder | undefined;
}
export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: seededOrders,
      add: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      getById: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "fb-orders" },
  ),
);

// ---------- Location ----------
interface LocationState {
  zip: string;
  setZip: (z: string) => void;
}
export const useLocation = create<LocationState>()(
  persist(
    (set) => ({
      zip: "10001",
      setZip: (z) => set({ zip: z }),
    }),
    { name: "fb-location" },
  ),
);

// ---------- Cookie consent ----------
export interface CookiePrefs {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}
interface CookieState {
  decided: boolean;
  prefs: CookiePrefs;
  accept: () => void;
  reject: () => void;
  save: (prefs: CookiePrefs) => void;
}
export const useCookie = create<CookieState>()(
  persist(
    (set) => ({
      decided: false,
      prefs: { necessary: true, analytics: false, marketing: false, preferences: false },
      accept: () =>
        set({
          decided: true,
          prefs: { necessary: true, analytics: true, marketing: true, preferences: true },
        }),
      reject: () =>
        set({
          decided: true,
          prefs: { necessary: true, analytics: false, marketing: false, preferences: false },
        }),
      save: (prefs) => set({ decided: true, prefs }),
    }),
    { name: "fb-cookies" },
  ),
);

// ---------- Mock auth ----------
interface AuthState {
  user: { email: string; name: string } | null;
  addresses: typeof seededAddresses;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
}
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      addresses: seededAddresses,
      signIn: (email, name) => set({ user: { email, name: name ?? email.split("@")[0] } }),
      signOut: () => set({ user: null }),
    }),
    { name: "fb-auth" },
  ),
);
