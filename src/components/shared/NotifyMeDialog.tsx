import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNotify } from "@/stores";
import type { Product } from "@/data/catalog";
import { toast } from "sonner";

export function NotifyMeDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product;
}) {
  const [email, setEmail] = useState("");
  const subscribe = useNotify((s) => s.subscribe);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notify me when available</DialogTitle>
          <DialogDescription>
            We'll send you an email as soon as <strong>{product.name}</strong> is back in stock.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) {
              toast.error("Please enter a valid email");
              return;
            }
            subscribe(product.slug, email);
            toast.success("You're on the list — we'll email you as soon as it's back.");
            setEmail("");
            onOpenChange(false);
          }}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor={`notify-email-${product.slug}`}>Email address</Label>
            <Input
              id={`notify-email-${product.slug}`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Notify Me</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
