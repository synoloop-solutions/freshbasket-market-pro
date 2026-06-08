import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/shared/LegalLayout";

export const Route = createFileRoute("/legal/delivery-policy")({
  head: () => ({
    meta: [
      { title: "Delivery policy — FreshBasket Market" },
      { name: "description", content: "Detailed delivery policy and service guarantees from FreshBasket Market." },
      { property: "og:title", content: "Delivery policy" },
      { property: "og:url", content: "/legal/delivery-policy" },
    ],
    links: [{ rel: "canonical", href: "/legal/delivery-policy" }],
  }),
  component: () => (
    <LegalLayout title="Delivery policy">
      <p>FreshBasket delivers to 200+ ZIP codes across the US. Same-day windows are available in most metro areas.</p>
      <h2 className="text-lg font-semibold">Service area</h2>
      <p>Enter your ZIP at checkout to see availability and pricing.</p>
      <h2 className="text-lg font-semibold">On-time guarantee</h2>
      <p>If we miss your delivery window by more than 15 minutes, we'll credit you $5 toward your next order.</p>
    </LegalLayout>
  ),
});
