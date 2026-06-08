/**
 * Centralized image configuration.
 *
 * All imagery used across the site is referenced from this file so that a
 * future client can swap photography for their own brand by editing URLs in
 * one place — no component edits required.
 *
 * Source: Unsplash (free commercial use under the Unsplash License).
 * URLs use Unsplash's CDN with `auto=format` for modern formats (AVIF/WebP)
 * and `q=80` for quality/perf balance. Width is set per use-case.
 */

const U = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

// ---------- Brand / lifestyle ----------
export const lifestyleImages = {
  hero: U("1542838132-92c53300491e", 1200, 960), // groceries on wooden table
  heroMobile: U("1542838132-92c53300491e", 800, 800),
  delivery: U("1604719312566-8912e9227c6a", 1200, 800), // delivery person with bag
  deliveryAlt: U("1526367790999-0150786686a2", 1200, 800), // courier with box
  aboutStore: U("1488521787991-ed7bbaae773c", 1200, 800), // open-air market
  aboutTeam: U("1556909114-f6e7ad7d3136", 1200, 800), // grocer at counter
  shoppingFamily: U("1543168256-418811576931", 1200, 800), // shopping bags
  freshProduce: U("1610348725531-843dff563e2c", 1200, 800),
  organicFarm: U("1500937386664-56d1dfef3854", 1200, 800),
};

// ---------- Promo banners ----------
export const bannerImages = {
  freeDelivery: U("1607082348824-0a96f2a4b9da", 800, 500), // basket of groceries
  bogo: U("1604908176997-125f25cc6f3d", 800, 500), // pantry shelves
  family: U("1542838132-92c53300491e", 800, 500), // big basket
  weekly: U("1532635241-17e820acc59f", 800, 500),
};

// ---------- Category cover images ----------
export const categoryImages: Record<string, string> = {
  "fruits-vegetables": U("1610348725531-843dff563e2c"),
  "dairy-eggs": U("1488477181946-6428a0291777"),
  "meat-seafood": U("1607623814075-e51df1bdc82f"),
  bakery: U("1509440159596-0249088772ff"),
  pantry: U("1604908554007-0c3c3acec19f"),
  "frozen-foods": U("1567206563064-6f60f40a2b57"),
  beverages: U("1544145945-f90425340c7e"),
  snacks: U("1599490659213-e2b9527bd087"),
  organic: U("1542838132-92c53300491e"),
  household: U("1583947215259-38e31be8751f"),
  "personal-care": U("1556228720-195a672e8a03"),
};

// ---------- Per-product images (slug -> Unsplash photo) ----------
// Fallback: when a product slug is missing here, the catalog falls back to
// the category cover image so every product still ships with real photography.
export const productImages: Record<string, string> = {
  // Fruits & Vegetables
  "organic-bananas": U("1571771894821-ce9b6c11b08e"),
  "hass-avocados": U("1519162808019-7de1683fa2ad"),
  "strawberries-1lb": U("1464965911861-746a04b4bca6"),
  "baby-spinach": U("1576045057995-568f588f82fb"),
  "cherry-tomatoes": U("1546470427-e26264be0b0d"),
  "broccoli-crown": U("1459411552884-841db9b3cc2a"),
  "honeycrisp-apples": U("1568702846914-96b305d2aaeb"),
  "carrots-2lb": U("1582515073490-39981397c445"),

  // Dairy & Eggs
  "whole-milk-gallon": U("1563636619-e9143da7973b"),
  "large-eggs-dozen": U("1582722872445-44dc5f7e3c8f"),
  "greek-yogurt": U("1488477181946-6428a0291777"),
  "sharp-cheddar": U("1559561853-08451507cbe7"),
  "butter-unsalted": U("1589985270826-4b7bb135bc9d"),
  "almond-milk": U("1626078434443-2f88a1f97c10"),
  mozzarella: U("1452195100486-9cc805987862"),

  // Meat & Seafood
  "chicken-breast": U("1604503468506-a8da13d82791"),
  "ground-beef-85": U("1588168333986-5078d3ae3976"),
  "atlantic-salmon": U("1467003909585-2f8a72700288"),
  "shrimp-frozen": U("1565680018434-b513d5e5fd47"),
  "pork-chops": U("1602470520998-f4a52199a3d6"),
  "turkey-breast": U("1606728035253-49e8a23146de"),
  "bacon-thick": U("1528607929212-2636ec44253e"),

  // Bakery
  "sourdough-loaf": U("1549931319-a545dcf3bc73"),
  "whole-wheat-bread": U("1509440159596-0249088772ff"),
  "croissants-4pk": U("1555507036-ab1f4038808a"),
  "bagels-6pk": U("1585478259715-876acc5be8eb"),
  "blueberry-muffins": U("1607958996333-41aef7caefaa"),
  "chocolate-chip-cookies": U("1499636136210-6f4ee915583e"),

  // Pantry
  "olive-oil-evoo": U("1474979266404-7eaacbcd87c5"),
  "long-grain-rice": U("1586201375761-83865001e31c"),
  "pasta-spaghetti": U("1551462147-ff29053bfc14"),
  "marinara-sauce": U("1597362925123-77861d3fbac7"),
  "canned-black-beans": U("1604908554007-0c3c3acec19f"),
  "peanut-butter": U("1501012609564-86f7a72b4cb1"),
  "honey-raw": U("1587049352846-4a222e784d38"),
  "sea-salt": U("1518110925495-b37653ff89c4"),

  // Frozen
  "frozen-pizza": U("1604382354936-07c5d9983bd3"),
  "frozen-berries": U("1498557850523-fd3d118b962e"),
  "frozen-veggies": U("1540420773420-3366772f4999"),
  "ice-cream-vanilla": U("1576506295286-5cda18df43e7"),
  "frozen-fries": U("1573080496219-bb080dd4f877"),
  "frozen-dumplings": U("1496116218417-1a781b1c416c"),

  // Beverages
  "orange-juice": U("1600271886742-f049b6451b41"),
  "sparkling-water": U("1605680534541-71b85f2c0ecf"),
  "coffee-beans": U("1559056199-641a0ac8b55e"),
  "green-tea": U("1576092768241-dec231879fc3"),
  kombucha: U("1556679343-c7306c1976bc"),
  "almond-milk-lat": U("1600718374662-0483d2b9da44"),

  // Snacks
  "potato-chips": U("1566478989037-eec170784d0b"),
  "trail-mix": U("1599599810769-bcde5a160d32"),
  "dark-chocolate": U("1511381939415-e44015466834"),
  "granola-bars": U("1606312618017-1f8b1d3f5b2b"),
  "popcorn-microwave": U("1505686994434-e3cc5abf1330"),
  pretzels: U("1599490659213-e2b9527bd087"),

  // Organic
  "organic-blueberries": U("1498557850523-fd3d118b962e"),
  "organic-quinoa": U("1586201375761-83865001e31c"),
  "organic-chicken": U("1604503468506-a8da13d82791"),
  "organic-kale": U("1576045057995-568f588f82fb"),

  // Household
  "paper-towels": U("1583947215259-38e31be8751f"),
  "dish-soap": U("1585421514738-01798e348b17"),
  "laundry-detergent": U("1610557892470-55d9e80c0bce"),
  "trash-bags": U("1581578017093-cd30fce4eeb7"),
  "all-purpose-cleaner": U("1563453392212-326f5e854473"),

  // Personal Care
  shampoo: U("1556228720-195a672e8a03"),
  toothpaste: U("1607613009820-a29f7bb81c04"),
  "hand-soap": U("1585421514738-01798e348b17"),
  deodorant: U("1556228578-8c89e6adf883"),
  lotion: U("1556228453-efd6c1ff04f6"),
};

// ---------- Testimonial avatars ----------
export const testimonialAvatars: Record<string, string> = {
  "Maria González": U("1494790108377-be9c29b29330", 200, 200),
  "David Chen": U("1500648767791-00dcc994a43e", 200, 200),
  "Priya Sharma": U("1573496359142-b8d87734a5a2", 200, 200),
};

export const getProductImage = (slug: string, categorySlug?: string): string =>
  productImages[slug] ??
  (categorySlug ? categoryImages[categorySlug] : undefined) ??
  lifestyleImages.freshProduce;
