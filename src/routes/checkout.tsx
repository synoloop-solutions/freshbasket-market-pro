import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart, useOrders, useRecentlyPurchased, type MockOrder } from "@/stores";
import { products } from "@/data/catalog";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProductImage } from "@/components/shared/ProductImage";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPrice } from "@/lib/format";
import { Check, ShieldCheck, Lock, Truck, CreditCard, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — FreshBasket Market" },
      { name: "description", content: "Secure checkout in a few easy steps." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const steps = ["Customer", "Delivery", "Time", "Payment", "Review"] as const;
type Step = typeof steps[number];

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, discount, deliveryFee, tax, total, clear } = useCart();
  const addOrder = useOrders((s) => s.add);
  const pushPurchased = useRecentlyPurchased((s) => s.addMany);

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    zip: "",
    slot: "today-pm",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const set = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: "Checkout" }]} />
        <div className="mt-6">
          <EmptyState
            icon={<ShoppingCart className="h-10 w-10" />}
            title="Nothing to check out"
            description="Add items to your cart first."
            action={<Button asChild><Link to="/shop">Shop now</Link></Button>}
          />
        </div>
      </div>
    );
  }

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!data.email.includes("@") || !data.firstName || !data.lastName) {
        toast.error("Please fill in your contact details");
        return false;
      }
    }
    if (step === 1) {
      if (!data.line1 || !data.city || !data.state || !/^\d{5}$/.test(data.zip)) {
        toast.error("Please complete your delivery address");
        return false;
      }
    }
    if (step === 3) {
      if (!data.cardName || data.cardNumber.replace(/\s/g, "").length < 12 || !data.expiry || !data.cvc) {
        toast.error("Please enter valid card details");
        return false;
      }
    }
    return true;
  };

  const placeOrder = () => {
    const id = `FB-${Math.floor(100000 + Math.random() * 900000)}`;
    const order: MockOrder = {
      id,
      placedAt: new Date().toISOString(),
      status: "received",
      items: items.map((i) => {
        const p = productMap[i.slug];
        return { slug: p.slug, name: p.name, price: p.salePrice ?? p.price, quantity: i.quantity };
      }),
      subtotal: subtotal(),
      deliveryFee: deliveryFee(),
      tax: tax(),
      total: total(),
      address: { line1: data.line1, city: data.city, state: data.state, zip: data.zip },
      slot: slotLabel(data.slot),
      email: data.email,
    };
    addOrder(order);
    pushPurchased(items.map((i) => i.slug));
    clear();
    navigate({ to: "/order-confirmation/$id", params: { id } });
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === steps.length - 1) return placeOrder();
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => setStep(Math.max(0, step - 1));

  return (
    <div className="container-page space-y-6 py-6">
      <Breadcrumbs items={[{ label: "Checkout" }]} />
      <h1 className="font-display text-3xl font-bold">Checkout</h1>

      {/* Stepper */}
      <ol className="grid grid-cols-5 gap-1 sm:gap-2" aria-label="Checkout progress">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-col items-start gap-1">
            <div className={`h-1.5 w-full rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex items-center gap-1 text-[11px] font-medium sm:text-xs ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
              {i < step ? <Check className="h-3 w-3 text-primary" /> : <span>{i + 1}.</span>}
              <span className="hidden sm:inline">{s}</span>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 rounded-xl border bg-card p-5 sm:p-6">
          {step === 0 && (
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold">Customer information</legend>
              <Field id="email" label="Email" type="email" autoComplete="email" required value={data.email} onChange={(v) => set("email", v)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="firstName" label="First name" autoComplete="given-name" required value={data.firstName} onChange={(v) => set("firstName", v)} />
                <Field id="lastName" label="Last name" autoComplete="family-name" required value={data.lastName} onChange={(v) => set("lastName", v)} />
              </div>
              <Field id="phone" label="Phone (optional)" type="tel" autoComplete="tel" value={data.phone} onChange={(v) => set("phone", v)} />
              <p className="text-xs text-muted-foreground">Already have an account? <Link to="/auth/login" className="text-primary underline">Sign in</Link></p>
            </fieldset>
          )}
          {step === 1 && (
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold">Delivery address</legend>
              <Field id="line1" label="Street address" autoComplete="address-line1" required value={data.line1} onChange={(v) => set("line1", v)} />
              <div className="grid gap-3 sm:grid-cols-3">
                <Field id="city" label="City" autoComplete="address-level2" required value={data.city} onChange={(v) => set("city", v)} />
                <Field id="state" label="State" autoComplete="address-level1" required value={data.state} onChange={(v) => set("state", v)} />
                <Field id="zip" label="ZIP" autoComplete="postal-code" required value={data.zip} onChange={(v) => set("zip", v.replace(/\D/g, "").slice(0, 5))} />
              </div>
            </fieldset>
          )}
          {step === 2 && (
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold">Delivery time</legend>
              <RadioGroup value={data.slot} onValueChange={(v) => set("slot", v)} className="space-y-2">
                {slots.map((s) => (
                  <label key={s.id} className="flex items-start gap-3 rounded-lg border bg-card p-3 hover:bg-accent">
                    <RadioGroupItem value={s.id} id={s.id} className="mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                    <span className="text-sm font-semibold">{s.fee === 0 ? "Free" : formatPrice(s.fee)}</span>
                  </label>
                ))}
              </RadioGroup>
            </fieldset>
          )}
          {step === 3 && (
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold">Payment</legend>
              <div className="flex items-center gap-2 rounded-md bg-primary-soft p-2 text-xs text-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" /> Your card details are encrypted and never stored.
              </div>
              <Field id="cardName" label="Name on card" autoComplete="cc-name" required value={data.cardName} onChange={(v) => set("cardName", v)} />
              <Field id="cardNumber" label="Card number" inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="cc-number" required value={data.cardNumber} onChange={(v) => set("cardNumber", formatCard(v))} />
              <div className="grid grid-cols-2 gap-3">
                <Field id="expiry" label="Expiry" placeholder="MM / YY" autoComplete="cc-exp" required value={data.expiry} onChange={(v) => set("expiry", v)} />
                <Field id="cvc" label="CVC" placeholder="123" autoComplete="cc-csc" inputMode="numeric" required value={data.cvc} onChange={(v) => set("cvc", v.replace(/\D/g, "").slice(0, 4))} />
              </div>
            </fieldset>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Review your order</h2>
              <ReviewBlock title="Shipping to" body={`${data.firstName} ${data.lastName}\n${data.line1}\n${data.city}, ${data.state} ${data.zip}`} />
              <ReviewBlock title="Delivery slot" body={slotLabel(data.slot)} />
              <ReviewBlock title="Paying with" body={`•••• ${data.cardNumber.replace(/\s/g, "").slice(-4)}`} />
              <ul className="space-y-2">
                {items.map((i) => {
                  const p = productMap[i.slug];
                  return (
                    <li key={i.slug} className="flex items-center gap-3 rounded-md border bg-card p-2 text-sm">
                      <ProductImage src={p.image} emoji={p.emoji} hue={p.hue} alt="" size="sm" className="h-12 w-12 rounded-md" sizes="48px" />
                      <span className="flex-1">{p.name} × {i.quantity}</span>
                      <span className="font-medium">{formatPrice((p.salePrice ?? p.price) * i.quantity)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <Button variant="outline" onClick={back} disabled={step === 0}>Back</Button>
            <Button onClick={next} size="lg">
              {step === steps.length - 1 ? "Place order" : "Continue"}
            </Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="space-y-3 rounded-xl border bg-card p-5">
            <h2 className="text-base font-semibold">Summary</h2>
            <p className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? "item" : "items"}</p>
            <dl className="space-y-1.5 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal())} />
              {discount() > 0 && <Row label="Discount" value={`- ${formatPrice(discount())}`} className="text-sale" />}
              <Row label="Delivery" value={deliveryFee() === 0 ? "Free" : formatPrice(deliveryFee())} />
              <Row label="Tax" value={formatPrice(tax())} />
              <div className="my-2 h-px bg-border" />
              <Row label="Total" value={formatPrice(total())} bold />
            </dl>
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]">
              <Trust icon={<ShieldCheck className="h-4 w-4" />} label="SSL secure" />
              <Trust icon={<CreditCard className="h-4 w-4" />} label="PCI compliant" />
              <Trust icon={<Truck className="h-4 w-4" />} label="On-time guarantee" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const slots = [
  { id: "today-pm", label: "Today, 2 PM – 4 PM", description: "Get it in time for dinner", fee: 0 },
  { id: "today-evening", label: "Today, 6 PM – 8 PM", description: "Evening delivery window", fee: 0 },
  { id: "tomorrow-am", label: "Tomorrow, 8 AM – 10 AM", description: "Start your morning right", fee: 0 },
  { id: "express", label: "Express, within 60 minutes", description: "Priority delivery", fee: 4.99 },
];

const slotLabel = (id: string) => slots.find((s) => s.id === id)?.label ?? id;

const formatCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

function Field({ id, label, value, onChange, required, type = "text", autoComplete, placeholder, inputMode }: {
  id: string; label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; autoComplete?: string; placeholder?: string; inputMode?: "numeric" | "text";
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}{required && <span aria-hidden="true" className="ml-0.5 text-destructive">*</span>}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} autoComplete={autoComplete} placeholder={placeholder} inputMode={inputMode} />
    </div>
  );
}

function Row({ label, value, bold, className }: { label: string; value: string; bold?: boolean; className?: string }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold" : ""}`}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-foreground ${className ?? ""}`}>{value}</dd>
    </div>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded border bg-card p-1.5 text-muted-foreground">
      <span className="text-primary">{icon}</span> {label}
    </div>
  );
}

function ReviewBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <p className="mt-1 whitespace-pre-line text-sm text-foreground">{body}</p>
    </div>
  );
}
