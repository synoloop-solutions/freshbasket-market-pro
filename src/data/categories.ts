export interface Category {
  slug: string;
  name: string;
  emoji: string;
  hue: number; // for gradient placeholder
  blurb: string;
}

export const categories: Category[] = [
  { slug: "fruits-vegetables", name: "Fruits & Vegetables", emoji: "🥬", hue: 130, blurb: "Farm-fresh produce delivered daily" },
  { slug: "dairy-eggs", name: "Dairy & Eggs", emoji: "🥛", hue: 60, blurb: "Milk, cheese, butter & free-range eggs" },
  { slug: "meat-seafood", name: "Meat & Seafood", emoji: "🥩", hue: 15, blurb: "Premium cuts and sustainably caught fish" },
  { slug: "bakery", name: "Bakery", emoji: "🥖", hue: 40, blurb: "Baked fresh every morning" },
  { slug: "pantry", name: "Pantry", emoji: "🌾", hue: 50, blurb: "Staples, oils, spices and more" },
  { slug: "frozen-foods", name: "Frozen Foods", emoji: "🧊", hue: 210, blurb: "Easy meals and frozen favourites" },
  { slug: "beverages", name: "Beverages", emoji: "🥤", hue: 250, blurb: "Drinks for every occasion" },
  { slug: "snacks", name: "Snacks", emoji: "🍿", hue: 25, blurb: "Sweet, salty and everything between" },
  { slug: "organic", name: "Organic", emoji: "🌱", hue: 145, blurb: "Certified organic essentials" },
  { slug: "household", name: "Household Essentials", emoji: "🧻", hue: 200, blurb: "Cleaning and home basics" },
  { slug: "personal-care", name: "Personal Care", emoji: "🧴", hue: 320, blurb: "Daily care from trusted brands" },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
