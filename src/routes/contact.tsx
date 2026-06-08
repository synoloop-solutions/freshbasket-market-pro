import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us — FreshBasket Market" },
      { name: "description", content: "Get in touch with the FreshBasket support team. We respond within 4 business hours." },
      { property: "og:title", content: "Contact FreshBasket" },
      { property: "og:description", content: "Get help from the FreshBasket team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container-page space-y-6 py-10">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Contact us</h1>
        <p className="mt-1 text-sm text-muted-foreground">We typically reply within 4 business hours.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={(e) => { e.preventDefault(); (e.currentTarget as HTMLFormElement).reset(); toast.success("Thanks! We'll be in touch shortly."); }}
          className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" required autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" required autoComplete="email" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-subject">Subject</Label>
            <Input id="c-subject" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-message">Message</Label>
            <Textarea id="c-message" required rows={5} maxLength={1000} />
          </div>
          <Button type="submit">Send message</Button>
        </form>

        <aside className="space-y-3">
          <Contact icon={<Mail />} title="Email" body="hello@freshbasket.market" />
          <Contact icon={<Phone />} title="Phone" body="(555) 123-4567" />
          <Contact icon={<MessageCircle />} title="Live chat" body="Mon–Sun, 7 AM – 11 PM" />
        </aside>
      </div>
    </div>
  );
}

function Contact({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border bg-card p-4">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <p className="text-sm font-medium">{body}</p>
      </div>
    </div>
  );
}
