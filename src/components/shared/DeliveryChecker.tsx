import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin } from "lucide-react";
import { useLocation } from "@/stores";
import { toast } from "sonner";

export function DeliveryChecker({ variant = "default" }: { variant?: "default" | "compact" }) {
  const { zip, setZip } = useLocation();
  const [input, setInput] = useState(zip);
  const [checked, setChecked] = useState(false);

  const onCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(input)) {
      toast.error("Please enter a valid 5-digit ZIP code");
      return;
    }
    setZip(input);
    setChecked(true);
    toast.success("Same-day delivery available in your area!");
  };

  return (
    <div className={variant === "compact" ? "rounded-xl border bg-card p-4" : "rounded-2xl border bg-card p-5 sm:p-6 shadow-sm"}>
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className={variant === "compact" ? "text-base font-semibold" : "text-lg font-semibold"}>
          Check delivery availability
        </h2>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        Enter your ZIP code to see same-day delivery options near you.
      </p>
      <form onSubmit={onCheck} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="delivery-zip" className="sr-only">ZIP code</label>
        <Input
          id="delivery-zip"
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          placeholder="Enter ZIP code"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
          className="flex-1"
        />
        <Button type="submit" className="sm:w-auto">Check Availability</Button>
      </form>
      {checked && (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-primary-soft p-3 text-sm text-foreground" role="status" aria-live="polite">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p>
            <strong>Great news!</strong> Same-day delivery is available in {input}. Order before 2 PM
            for delivery today.
          </p>
        </div>
      )}
    </div>
  );
}
