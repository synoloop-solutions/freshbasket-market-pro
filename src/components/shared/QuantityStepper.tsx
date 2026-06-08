import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center rounded-md border bg-card" role="group" aria-label={label}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-r-none"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        disabled={value <= min}
      >
        <Minus size={16} />
      </Button>
      <span className="min-w-10 px-2 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-l-none"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        disabled={value >= max}
      >
        <Plus size={16} />
      </Button>
    </div>
  );
}
