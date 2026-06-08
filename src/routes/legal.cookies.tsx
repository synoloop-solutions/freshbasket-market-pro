import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/shared/LegalLayout";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie policy — FreshBasket Market" },
      { name: "description", content: "Learn how FreshBasket uses cookies and how to manage your preferences." },
      { property: "og:title", content: "Cookie policy" },
      { property: "og:url", content: "/legal/cookies" },
    ],
    links: [{ rel: "canonical", href: "/legal/cookies" }],
  }),
  component: () => (
    <LegalLayout title="Cookie policy">
      <p>We use cookies and similar technologies to keep you signed in, remember your basket, and understand how the site is used.</p>
      <h2 className="text-lg font-semibold">Categories</h2>
      <ul className="ml-4 list-disc space-y-1">
        <li><strong>Necessary</strong> — required for the site to function.</li>
        <li><strong>Analytics</strong> — help us improve the shopping experience.</li>
        <li><strong>Marketing</strong> — personalized offers and ads.</li>
        <li><strong>Preferences</strong> — remember your settings.</li>
      </ul>
      <p>Manage your preferences any time from the cookie banner at the bottom of the page.</p>
    </LegalLayout>
  ),
});
