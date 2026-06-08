import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/shared/LegalLayout";

export const Route = createFileRoute("/legal/returns")({
  head: () => ({
    meta: [
      { title: "Returns policy — FreshBasket Market" },
      { name: "description", content: "Easy returns and refunds at FreshBasket Market." },
      { property: "og:title", content: "Returns policy" },
      { property: "og:url", content: "/legal/returns" },
    ],
    links: [{ rel: "canonical", href: "/legal/returns" }],
  }),
  component: () => (
    <LegalLayout title="Returns policy">
      <p>If you're not happy with your order, you can request a refund or replacement within 7 days of delivery — no questions asked.</p>
      <h2 className="text-lg font-semibold">How to start a return</h2>
      <p>Go to your account, find the order, and tap "Return". Our team will process the refund within 3 business days.</p>
      <h2 className="text-lg font-semibold">Items not eligible</h2>
      <p>Alcohol, tobacco, and gift cards are non-refundable where permitted by law.</p>
    </LegalLayout>
  ),
});
