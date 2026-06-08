import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "When will my groceries arrive?", a: "Most same-day orders arrive within 2 hours of placement. Express orders arrive in 60 minutes." },
  { q: "What happens if an item is out of stock?", a: "Our shoppers will substitute with a similar item or refund you — your choice in account settings." },
  { q: "Can I change or cancel my order?", a: "Yes, you can edit or cancel any order up to 1 hour before your delivery window." },
  { q: "How do I redeem a promo code?", a: "Enter your code in the cart or at checkout. We accept one code per order." },
  { q: "Is there a minimum order?", a: "No minimum order. Orders under $35 have a $4.99 delivery fee." },
  { q: "How do I return items?", a: "Tap Return in your order history within 7 days of delivery and we'll issue a refund." },
  { q: "Is my payment information secure?", a: "All payments are processed over a 256-bit SSL connection and we are PCI-DSS compliant." },
  { q: "Do you offer tip support for drivers?", a: "Yes — you can tip during checkout or after delivery. 100% goes to the driver." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — FreshBasket Market" },
      { name: "description", content: "Answers to common questions about delivery, returns, payments, and your account." },
      { property: "og:title", content: "FreshBasket FAQs" },
      { property: "og:description", content: "Common questions about FreshBasket." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd) }],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="container-page max-w-3xl space-y-6 py-10">
      <Breadcrumbs items={[{ label: "FAQs" }]} />
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Frequently asked questions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything you need to know about shopping with FreshBasket.</p>
      </header>
      <Accordion type="single" collapsible className="rounded-2xl border bg-card">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-b-0">
            <AccordionTrigger className="px-4 text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
