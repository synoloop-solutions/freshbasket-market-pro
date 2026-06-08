// Seeded mock content (lists, past orders) used to bootstrap stores on first load.
import { products } from "./catalog";

export const seededLists = [
  {
    id: "weekly-essentials",
    name: "Weekly Essentials",
    productSlugs: ["whole-milk-gallon", "large-eggs-dozen", "sourdough-loaf", "organic-bananas", "baby-spinach"],
    createdAt: "2025-11-01",
  },
  {
    id: "breakfast-items",
    name: "Breakfast Items",
    productSlugs: ["greek-yogurt", "coffee-beans", "granola-bars", "blueberry-muffins", "frozen-berries"],
    createdAt: "2025-11-12",
  },
  {
    id: "family-shopping-list",
    name: "Family Shopping List",
    productSlugs: ["chicken-breast", "long-grain-rice", "broccoli-crown", "carrots-2lb", "olive-oil-evoo", "marinara-sauce", "pasta-spaghetti"],
    createdAt: "2025-12-01",
  },
];

const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

export const seededOrders = [
  {
    id: "FB-100245",
    placedAt: "2025-12-01T14:32:00Z",
    status: "delivered" as const,
    items: ["whole-milk-gallon", "large-eggs-dozen", "organic-bananas", "sourdough-loaf"].map((slug) => ({
      slug,
      name: productMap[slug].name,
      price: productMap[slug].salePrice ?? productMap[slug].price,
      quantity: 1,
    })),
    subtotal: 14.26,
    deliveryFee: 0,
    tax: 1.18,
    total: 15.44,
  },
  {
    id: "FB-100198",
    placedAt: "2025-11-22T10:11:00Z",
    status: "delivered" as const,
    items: ["coffee-beans", "greek-yogurt", "blueberry-muffins", "almond-milk"].map((slug) => ({
      slug,
      name: productMap[slug].name,
      price: productMap[slug].salePrice ?? productMap[slug].price,
      quantity: 1,
    })),
    subtotal: 29.96,
    deliveryFee: 3.99,
    tax: 2.49,
    total: 36.44,
  },
];

export const seededAddresses = [
  { id: "addr-1", label: "Home", line1: "123 Maple Street", city: "Brooklyn", state: "NY", zip: "11201", isDefault: true },
];
