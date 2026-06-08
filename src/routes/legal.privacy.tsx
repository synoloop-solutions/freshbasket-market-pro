import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/shared/LegalLayout";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — FreshBasket Market" },
      { name: "description", content: "How FreshBasket collects, uses and protects your personal data." },
      { property: "og:title", content: "Privacy policy" },
      { property: "og:url", content: "/legal/privacy" },
    ],
    links: [{ rel: "canonical", href: "/legal/privacy" }],
  }),
  component: () => (
    <LegalLayout title="Privacy policy">
      <p>FreshBasket Market ("we", "us", "our") respects your privacy. This policy explains what data we collect, why we collect it, and how we protect it.</p>
      <h2 className="text-lg font-semibold">Information we collect</h2>
      <p>Account details, order history, delivery addresses, device information, and cookie preferences.</p>
      <h2 className="text-lg font-semibold">How we use your data</h2>
      <p>To process orders, communicate with you, improve the shopping experience, and meet legal obligations.</p>
      <h2 className="text-lg font-semibold">Your rights</h2>
      <p>You can request a copy, correction or deletion of your data at any time by emailing privacy@freshbasket.market.</p>
    </LegalLayout>
  ),
});
