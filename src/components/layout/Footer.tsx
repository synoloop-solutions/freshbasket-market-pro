import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-cream">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Farm-fresh groceries delivered to your door in as little as 60 minutes. Trusted by
              over 500,000 families across the country.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const email = String(data.get("email") ?? "");
                if (!email.includes("@")) return toast.error("Please enter a valid email");
                e.currentTarget.reset();
                toast.success("Subscribed! Check your inbox for a welcome offer.");
              }}
              className="mt-4 flex max-w-sm gap-2"
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <Input id="footer-email" name="email" type="email" placeholder="Your email" required />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>

          <FooterCol title="Company" links={[
            { to: "/about", label: "About us" },
            { to: "/contact", label: "Contact" },
            { to: "/faq", label: "FAQs" },
            { to: "/delivery", label: "Delivery" },
          ]} />
          <FooterCol title="Help" links={[
            { to: "/track-order", label: "Track order" },
            { to: "/lists", label: "Shopping lists" },
            { to: "/wishlist", label: "Wishlist" },
            { to: "/account", label: "Account" },
          ]} />
          <FooterCol title="Legal" links={[
            { to: "/legal/privacy", label: "Privacy policy" },
            { to: "/legal/terms", label: "Terms of service" },
            { to: "/legal/cookies", label: "Cookie policy" },
            { to: "/legal/returns", label: "Returns" },
            { to: "/legal/delivery-policy", label: "Delivery policy" },
          ]} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FreshBasket Market. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} label="Facebook" />
            <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} label="Instagram" />
            <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
            <SocialLink href="mailto:hello@freshbasket.market" icon={<Mail className="h-4 w-4" />} label="Email us" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to as string} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border bg-background hover:bg-accent"
    >
      {icon}
    </a>
  );
}
