import { Truck, X } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "fb-announce-dismissed-v1";

export function AnnouncementBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setShow(localStorage.getItem(KEY) !== "1");
  }, []);
  if (!show) return null;
  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="container-page flex items-center justify-center gap-2 py-2 text-center text-xs font-medium sm:text-sm">
        <Truck className="h-4 w-4" aria-hidden="true" />
        <span>Free same-day delivery on orders over $35 — use code <strong>FREESHIP</strong></span>
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(KEY, "1");
          setShow(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-primary-foreground/10"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
