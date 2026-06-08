import { useState } from "react";
import { useCookie, type CookiePrefs } from "@/stores";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";

export function CookieBanner() {
  const { decided, prefs, accept, reject, save } = useCookie();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<CookiePrefs>(prefs);

  if (decided) return null;

  return (
    <>
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed inset-x-3 bottom-3 z-50 rounded-xl border bg-card p-4 shadow-lg sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-md"
      >
        <h2 className="text-sm font-semibold">We use cookies</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          We use cookies to personalize content, deliver ads, and analyze traffic. See our{" "}
          <Link to="/legal/cookies" className="underline">Cookie policy</Link>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={accept}>Accept all</Button>
          <Button size="sm" variant="outline" onClick={reject}>Reject all</Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>Customize</Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Manage which categories of cookies you'd like to allow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <ToggleRow label="Necessary" description="Required for the site to function." checked disabled />
            <ToggleRow
              label="Analytics"
              description="Help us understand how the site is used."
              checked={local.analytics}
              onChange={(v) => setLocal((s) => ({ ...s, analytics: v }))}
            />
            <ToggleRow
              label="Marketing"
              description="Personalized ads and content."
              checked={local.marketing}
              onChange={(v) => setLocal((s) => ({ ...s, marketing: v }))}
            />
            <ToggleRow
              label="Preferences"
              description="Remember layout and language preferences."
              checked={local.preferences}
              onChange={(v) => setLocal((s) => ({ ...s, preferences: v }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { save(local); setOpen(false); }}>Save preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ToggleRow({ label, description, checked, onChange, disabled }: { label: string; description: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} aria-label={label} />
    </div>
  );
}
