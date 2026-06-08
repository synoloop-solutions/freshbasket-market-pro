export interface Review {
  id: string;
  productSlug: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

const sampleReviews = [
  { title: "Excellent quality", body: "Arrived fresh and exactly as described. Will reorder for sure." },
  { title: "Great value", body: "Better than what I get at my local store and same-day delivery is a game changer." },
  { title: "Family favorite", body: "My kids love this. We've made it a weekly staple." },
  { title: "Solid pick", body: "Good product, fair price. Packaging held up well in transit." },
  { title: "Highly recommend", body: "Tasted fantastic and the freshness was on point." },
];

export const reviewsFor = (slug: string): Review[] =>
  sampleReviews.map((r, i) => ({
    id: `${slug}-${i}`,
    productSlug: slug,
    author: ["Alex P.", "Jordan M.", "Sam L.", "Riley T.", "Casey W."][i],
    rating: [5, 5, 4, 5, 4][i],
    date: ["2025-11-12", "2025-10-30", "2025-10-18", "2025-09-22", "2025-09-04"][i],
    ...r,
  }));

export const testimonials = [
  {
    name: "Maria González",
    role: "Verified shopper",
    quote: "FreshBasket has replaced my weekly grocery run. The produce is always crisp and delivery is shockingly fast.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Verified shopper",
    quote: "I love being able to build saved lists for the week. Reordering takes literally one tap.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Verified shopper",
    quote: "Prices are competitive, and the same-day window has saved me on more than one dinner party.",
    rating: 5,
  },
];
