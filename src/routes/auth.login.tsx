import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — FreshBasket Market" },
      { name: "description", content: "Sign in to your FreshBasket account." },
      { property: "og:title", content: "Sign in" },
      { property: "og:url", content: "/auth/login" },
    ],
    links: [{ rel: "canonical", href: "/auth/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useAuth((s) => s.signIn);
  const navigate = useNavigate();

  return (
    <div className="container-page flex justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <Logo />
          <h1 className="mt-4 font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue shopping.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@") || password.length < 6) {
              toast.error("Please check your email and password");
              return;
            }
            signIn(email);
            toast.success("Signed in!");
            navigate({ to: "/account" });
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Label htmlFor="login-pw">Password</Label>
              <Link to="/auth/reset-password" className="text-xs text-primary hover:underline">Forgot?</Link>
            </div>
            <Input id="login-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required minLength={6} />
          </div>
          <Button type="submit" className="w-full" size="lg">Sign in</Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New here? <Link to="/auth/register" className="text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
