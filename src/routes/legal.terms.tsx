import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/shared/LegalLayout";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — FreshBasket Market" },
      { name: "description", content: "Terms and conditions for using FreshBasket Market." },
      { property: "og:title", content: "Terms of service" },
      { property: "og:url", content: "/legal/terms" },
    ],
    links: [{ rel: "canonical", href: "/legal/terms" }],
  }),
  component: () => (
    <LegalLayout title="Terms of service">
      <p>By using FreshBasket Market you agree to the following terms. Please read them carefully.</p>
      <h2 className="text-lg font-semibold">Use of the service</h2>
      <p>You must be at least 18 years old and provide accurate information when placing orders.</p>
      <h2 className="text-lg font-semibold">Pricing & availability</h2>
      <p>Prices and product availability can change. We'll always notify you of substitutions or shortages.</p>
      <h2 className="text-lg font-semibold">Liability</h2>
      <p>Our liability is limited to the value of the order in question, except where required by law.</p>
    </LegalLayout>
  ),
});
