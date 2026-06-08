import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownTimer({ hours = 8 }: { hours?: number }) {
  const [target] = useState(() => Date.now() + hours * 3600 * 1000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const remaining = Math.max(0, target - now);
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-sale/10 px-3 py-1 text-sm font-semibold text-sale" role="timer" aria-label={`${h} hours ${m} minutes left`}>
      <span className="text-xs uppercase tracking-wide">Ends in</span>
      <span className="font-mono">{pad(h)}:{pad(m)}:{pad(s)}</span>
    </div>
  );
}
