import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Newsletter() {
  return (
    <section className="rounded-3xl bg-primary p-6 text-primary-foreground sm:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Save 10% on your first order</h2>
        <p className="mt-2 text-sm opacity-90">
          Sign up for weekly deals, seasonal recipes, and early access to new arrivals.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const email = String(data.get("email") ?? "");
            if (!email.includes("@")) return toast.error("Please enter a valid email");
            e.currentTarget.reset();
            toast.success("Thanks! Your 10% off code is on its way.");
          }}
          className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <label htmlFor="news-email" className="sr-only">Email</label>
          <Input
            id="news-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="border-primary-foreground/30 bg-primary-foreground text-foreground placeholder:text-muted-foreground"
          />
          <Button type="submit" variant="secondary">Get 10% off</Button>
        </form>
        <p className="mt-3 text-xs opacity-75">No spam — unsubscribe any time.</p>
      </div>
    </section>
  );
}
