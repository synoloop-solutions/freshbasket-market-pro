import { categories } from "./categories";
import { getProductImage } from "./images";

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  salePrice?: number;
  unit: string;
  rating: number;
  reviewCount: number;
  badges: ("organic" | "bogo" | "new" | "trending" | "bestseller" | "vegan" | "gluten-free")[];
  inStock: boolean;
  emoji: string;
  hue: number;
  /** Stock photo URL (sourced from src/data/images.ts). */
  image: string;
  description: string;
  ingredients: string;
  nutrition: { calories: number; protein: number; carbs: number; fat: number };
  storage: string;
  allergens: string;
  origin: string;
}

// Deterministic small hash for reproducible mock rating/reviewCount values
// (avoids SSR/CSR hydration mismatch from Math.random).
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

// Helper to build a product
const p = (
  category: string,
  slug: string,
  name: string,
  brand: string,
  price: number,
  unit: string,
  emoji: string,
  hue: number,
  opts: Partial<Product> = {},
): Product => {
  const h = hash(slug);
  return {
    slug,
    name,
    brand,
    category,
    price,
    unit,
    emoji,
    hue,
    image: opts.image ?? getProductImage(slug, category),
    rating: opts.rating ?? Number((4.3 + ((h % 60) / 100)).toFixed(1)),
    reviewCount: opts.reviewCount ?? 20 + (h % 400),
    badges: opts.badges ?? [],
    inStock: opts.inStock ?? true,
    salePrice: opts.salePrice,
    description:
      opts.description ??
      `Carefully sourced ${name.toLowerCase()} from trusted ${brand} producers. Perfect for everyday cooking and family meals.`,
    ingredients: opts.ingredients ?? "100% natural ingredients. No artificial preservatives.",
    nutrition: opts.nutrition ?? { calories: 120, protein: 3, carbs: 18, fat: 4 },
    storage: opts.storage ?? "Store in a cool, dry place. Refrigerate after opening.",
    allergens: opts.allergens ?? "May contain traces of nuts, dairy or gluten.",
    origin: opts.origin ?? "Locally sourced",
  };
};

export const products: Product[] = [
  // Fruits & Vegetables
  p("fruits-vegetables", "organic-bananas", "Organic Bananas", "FarmHouse", 1.49, "per lb", "🍌", 80, { badges: ["organic", "bestseller"], rating: 4.8, reviewCount: 412 }),
  p("fruits-vegetables", "hass-avocados", "Hass Avocados", "GreenLeaf", 1.99, "each", "🥑", 140, { salePrice: 1.49, badges: ["trending"], rating: 4.6 }),
  p("fruits-vegetables", "strawberries-1lb", "Fresh Strawberries", "BerryFields", 4.99, "1 lb pack", "🍓", 10, { badges: ["new"], rating: 4.7 }),
  p("fruits-vegetables", "baby-spinach", "Baby Spinach", "GreenLeaf", 3.49, "5 oz bag", "🥬", 130, { badges: ["organic"] }),
  p("fruits-vegetables", "cherry-tomatoes", "Cherry Tomatoes", "SunHarvest", 3.29, "1 pint", "🍅", 15, { badges: ["bestseller"] }),
  p("fruits-vegetables", "broccoli-crown", "Broccoli Crowns", "FarmHouse", 2.49, "per lb", "🥦", 135, {}),
  p("fruits-vegetables", "honeycrisp-apples", "Honeycrisp Apples", "OrchardOne", 2.99, "per lb", "🍎", 20, { salePrice: 2.49, badges: ["trending"] }),
  p("fruits-vegetables", "carrots-2lb", "Carrots", "FarmHouse", 1.79, "2 lb bag", "🥕", 35, {}),

  // Dairy & Eggs
  p("dairy-eggs", "whole-milk-gallon", "Whole Milk", "Meadowfield", 3.99, "1 gallon", "🥛", 60, { badges: ["bestseller"], rating: 4.7 }),
  p("dairy-eggs", "large-eggs-dozen", "Large Free-Range Eggs", "HappyHen", 4.79, "12 ct", "🥚", 50, { badges: ["organic", "trending"], rating: 4.8 }),
  p("dairy-eggs", "greek-yogurt", "Greek Yogurt", "PureDairy", 5.49, "32 oz", "🥣", 70, { salePrice: 4.49 }),
  p("dairy-eggs", "sharp-cheddar", "Sharp Cheddar", "AgedFarms", 5.99, "8 oz block", "🧀", 45, { badges: ["bestseller"] }),
  p("dairy-eggs", "butter-unsalted", "Unsalted Butter", "Meadowfield", 4.99, "1 lb", "🧈", 65, {}),
  p("dairy-eggs", "almond-milk", "Almond Milk", "NutriSip", 3.99, "64 oz", "🥛", 75, { badges: ["vegan"] }),
  p("dairy-eggs", "mozzarella", "Fresh Mozzarella", "AgedFarms", 6.49, "8 oz ball", "🧀", 55, { inStock: false }),

  // Meat & Seafood
  p("meat-seafood", "chicken-breast", "Boneless Chicken Breast", "PrimeCut", 8.99, "per lb", "🍗", 15, { badges: ["bestseller"], rating: 4.7 }),
  p("meat-seafood", "ground-beef-85", "Ground Beef 85/15", "PrimeCut", 6.99, "per lb", "🥩", 10, { salePrice: 5.99, badges: ["trending"] }),
  p("meat-seafood", "atlantic-salmon", "Atlantic Salmon Fillet", "BlueWave", 12.99, "per lb", "🐟", 200, { rating: 4.8 }),
  p("meat-seafood", "shrimp-frozen", "Wild Caught Shrimp", "BlueWave", 14.99, "1 lb bag", "🦐", 5, {}),
  p("meat-seafood", "pork-chops", "Bone-In Pork Chops", "PrimeCut", 7.49, "per lb", "🥓", 12, {}),
  p("meat-seafood", "turkey-breast", "Sliced Turkey Breast", "DeliCo", 9.49, "per lb", "🍗", 25, { badges: ["new"] }),
  p("meat-seafood", "bacon-thick", "Thick-Cut Bacon", "PrimeCut", 6.99, "12 oz", "🥓", 18, { inStock: false }),

  // Bakery
  p("bakery", "sourdough-loaf", "Artisan Sourdough", "OvenCraft", 4.99, "1 loaf", "🍞", 40, { badges: ["bestseller", "new"], rating: 4.9 }),
  p("bakery", "whole-wheat-bread", "Whole Wheat Bread", "OvenCraft", 3.79, "24 oz", "🍞", 38, {}),
  p("bakery", "croissants-4pk", "Butter Croissants", "ParisRise", 5.99, "4 pack", "🥐", 45, { badges: ["trending"] }),
  p("bakery", "bagels-6pk", "Plain Bagels", "OvenCraft", 4.49, "6 pack", "🥯", 42, {}),
  p("bakery", "blueberry-muffins", "Blueberry Muffins", "ParisRise", 5.49, "4 pack", "🧁", 250, {}),
  p("bakery", "chocolate-chip-cookies", "Chocolate Chip Cookies", "SweetBite", 4.99, "12 ct", "🍪", 30, { salePrice: 3.99 }),

  // Pantry
  p("pantry", "olive-oil-evoo", "Extra Virgin Olive Oil", "MediterraGold", 12.99, "500 ml", "🫒", 90, { badges: ["bestseller"], rating: 4.8 }),
  p("pantry", "long-grain-rice", "Long Grain White Rice", "GrainHouse", 8.99, "5 lb bag", "🍚", 60, {}),
  p("pantry", "pasta-spaghetti", "Spaghetti", "Pastificio", 1.99, "1 lb", "🍝", 50, { badges: ["bestseller"] }),
  p("pantry", "marinara-sauce", "Marinara Sauce", "Pastificio", 4.49, "24 oz jar", "🍅", 15, {}),
  p("pantry", "canned-black-beans", "Black Beans", "PantryPro", 1.29, "15 oz can", "🫘", 30, {}),
  p("pantry", "peanut-butter", "Creamy Peanut Butter", "NuttyJoy", 5.99, "16 oz", "🥜", 35, { badges: ["trending"] }),
  p("pantry", "honey-raw", "Raw Wildflower Honey", "BeeMeadow", 9.99, "16 oz", "🍯", 55, { badges: ["organic"] }),
  p("pantry", "sea-salt", "Sea Salt", "Saltworks", 3.49, "16 oz", "🧂", 0, {}),

  // Frozen
  p("frozen-foods", "frozen-pizza", "Margherita Pizza", "ForniFrozen", 7.99, "12 inch", "🍕", 20, { salePrice: 6.49, badges: ["trending"] }),
  p("frozen-foods", "frozen-berries", "Mixed Berries", "BerryFields", 6.99, "1.5 lb bag", "🫐", 280, { badges: ["organic"] }),
  p("frozen-foods", "frozen-veggies", "Stir Fry Vegetables", "GreenLeaf", 4.49, "1 lb bag", "🥦", 135, {}),
  p("frozen-foods", "ice-cream-vanilla", "Vanilla Bean Ice Cream", "CreamDream", 5.99, "1.5 qt", "🍨", 50, { badges: ["bestseller"] }),
  p("frozen-foods", "frozen-fries", "Crinkle-Cut Fries", "GoldenSpud", 3.99, "32 oz", "🍟", 40, {}),
  p("frozen-foods", "frozen-dumplings", "Pork Dumplings", "AsianFoods", 7.49, "20 ct", "🥟", 25, { badges: ["new"] }),

  // Beverages
  p("beverages", "orange-juice", "100% Orange Juice", "FreshSqueeze", 4.99, "64 oz", "🧃", 35, { badges: ["bestseller"] }),
  p("beverages", "sparkling-water", "Sparkling Water Variety", "BubbleCo", 6.99, "12 pack", "🥤", 200, { salePrice: 5.49 }),
  p("beverages", "coffee-beans", "Whole Bean Coffee", "RoastHouse", 14.99, "12 oz", "☕", 30, { badges: ["organic", "bestseller"], rating: 4.9 }),
  p("beverages", "green-tea", "Organic Green Tea", "LeafLore", 5.49, "20 bags", "🍵", 140, { badges: ["organic"] }),
  p("beverages", "kombucha", "Ginger Kombucha", "FermentLab", 4.49, "16 oz", "🥤", 130, { badges: ["new", "trending"] }),
  p("beverages", "almond-milk-lat", "Oat Milk", "OatHaven", 4.99, "64 oz", "🥛", 75, { badges: ["vegan"] }),

  // Snacks
  p("snacks", "potato-chips", "Sea Salt Potato Chips", "CrunchCo", 3.99, "8 oz", "🥔", 40, { badges: ["bestseller"] }),
  p("snacks", "trail-mix", "Trail Mix", "NuttyJoy", 7.99, "16 oz", "🥜", 35, {}),
  p("snacks", "dark-chocolate", "Dark Chocolate 70%", "CacaoCraft", 4.99, "3.5 oz bar", "🍫", 25, { badges: ["organic"] }),
  p("snacks", "granola-bars", "Honey Almond Granola Bars", "GoodMorning", 5.49, "10 ct", "🥣", 45, {}),
  p("snacks", "popcorn-microwave", "Butter Popcorn", "PopHouse", 4.49, "6 pack", "🍿", 50, { salePrice: 3.49 }),
  p("snacks", "pretzels", "Mini Pretzels", "TwistCo", 3.29, "16 oz", "🥨", 40, {}),

  // Organic (curated cross-category)
  p("organic", "organic-blueberries", "Organic Blueberries", "BerryFields", 5.99, "6 oz", "🫐", 260, { badges: ["organic", "trending"], rating: 4.8 }),
  p("organic", "organic-quinoa", "Organic Quinoa", "GrainHouse", 8.99, "16 oz", "🌾", 70, { badges: ["organic", "vegan"] }),
  p("organic", "organic-chicken", "Organic Whole Chicken", "PrimeCut", 14.99, "3 lb avg", "🍗", 20, { badges: ["organic"] }),
  p("organic", "organic-kale", "Organic Kale", "GreenLeaf", 3.49, "1 bunch", "🥬", 130, { badges: ["organic"] }),

  // Household
  p("household", "paper-towels", "Paper Towels", "CleanHome", 11.99, "6 rolls", "🧻", 200, { badges: ["bestseller"] }),
  p("household", "dish-soap", "Lemon Dish Soap", "EcoClean", 4.49, "28 oz", "🧼", 70, { salePrice: 3.49 }),
  p("household", "laundry-detergent", "Laundry Detergent", "CleanHome", 13.99, "92 oz", "🧴", 240, {}),
  p("household", "trash-bags", "Tall Kitchen Bags", "BagWell", 9.49, "50 ct", "🗑️", 0, {}),
  p("household", "all-purpose-cleaner", "All-Purpose Cleaner", "EcoClean", 4.99, "32 oz", "🧴", 145, { badges: ["new"] }),

  // Personal Care
  p("personal-care", "shampoo", "Daily Shampoo", "PureGlow", 6.99, "16 oz", "🧴", 320, {}),
  p("personal-care", "toothpaste", "Whitening Toothpaste", "BrightSmile", 4.49, "5.5 oz", "🪥", 200, { badges: ["bestseller"] }),
  p("personal-care", "hand-soap", "Hand Soap", "PureGlow", 3.99, "12 oz", "🧼", 70, {}),
  p("personal-care", "deodorant", "Natural Deodorant", "PureGlow", 7.99, "2.6 oz", "🧴", 310, { badges: ["organic"] }),
  p("personal-care", "lotion", "Body Lotion", "PureGlow", 8.49, "16 oz", "🧴", 320, { salePrice: 6.99 }),
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category === category);
export const trending = () => products.filter((p) => p.badges.includes("trending")).slice(0, 8);
export const bestsellers = () => products.filter((p) => p.badges.includes("bestseller")).slice(0, 8);
export const newArrivals = () => products.filter((p) => p.badges.includes("new")).slice(0, 8);
export const onSale = () => products.filter((p) => p.salePrice).slice(0, 8);
export const popular = () => products.slice(0, 12);

export const allCategories = categories;
