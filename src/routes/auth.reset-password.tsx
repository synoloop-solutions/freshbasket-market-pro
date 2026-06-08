import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — FreshBasket Market" },
      { name: "description", content: "Reset your FreshBasket password." },
      { property: "og:title", content: "Reset password" },
      { property: "og:url", content: "/auth/reset-password" },
    ],
    links: [{ rel: "canonical", href: "/auth/reset-password" }],
  }),
  component: ResetPage,
});

function ResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page flex justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <Logo />
          <h1 className="mt-4 font-display text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground">We'll send you a reset link.</p>
        </div>
        {sent ? (
          <div className="rounded-md bg-primary-soft p-4 text-sm">
            If <strong>{email}</strong> matches an account, you'll get an email shortly.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) return toast.error("Enter a valid email");
              setSent(true);
              toast.success("Reset link sent");
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="reset-email">Email</Label>
              <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" size="lg">Send reset link</Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
