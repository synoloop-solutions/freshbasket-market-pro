import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create account — FreshBasket Market" },
      { name: "description", content: "Sign up for FreshBasket and save 10% on your first order." },
      { property: "og:title", content: "Create account" },
      { property: "og:url", content: "/auth/register" },
    ],
    links: [{ rel: "canonical", href: "/auth/register" }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useAuth((s) => s.signIn);
  const navigate = useNavigate();

  return (
    <div className="container-page flex justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <Logo />
          <h1 className="mt-4 font-display text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Save 10% on your first order.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@") || password.length < 6) {
              toast.error("Please complete all fields correctly");
              return;
            }
            signIn(email, name);
            toast.success("Account created!");
            navigate({ to: "/account" });
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="reg-name">Full name</Label>
            <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-pw">Password</Label>
            <Input id="reg-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
            <p className="text-xs text-muted-foreground">At least 6 characters.</p>
          </div>
          <Button type="submit" className="w-full" size="lg">Create account</Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
