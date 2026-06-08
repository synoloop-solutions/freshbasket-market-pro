import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, ShieldCheck } from "lucide-react";
import { DeliveryChecker } from "@/components/shared/DeliveryChecker";
import { lifestyleImages } from "@/data/images";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-soft via-cream to-background">
      <div className="container-page grid items-center gap-8 py-10 md:grid-cols-2 md:gap-12 md:py-16 lg:py-20">
        <div className="space-y-5 animate-fade-in-up">
          <Badge className="bg-sale text-sale-foreground hover:bg-sale">
            <Truck className="mr-1 h-3 w-3" /> Same-day delivery
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Fresh groceries,<br />
            <span className="text-primary">delivered today.</span>
          </h1>
          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            Hand-picked produce, pantry staples, and weekly essentials — at your door in as little
            as 60 minutes.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link to="/shop">Shop now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/delivery">How delivery works</Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> 60-min delivery</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Fresh guarantee</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Free over $35</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-card shadow-xl">
            <img
              src={lifestyleImages.hero}
              alt="Fresh fruits and vegetables arranged on a wooden table"
              fetchPriority="high"
              decoding="async"
              sizes="(max-width:768px) 100vw, 50vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/40 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 rounded-xl bg-background/95 p-3 shadow-lg backdrop-blur">
              <p className="text-xs font-medium text-muted-foreground">Today's pick</p>
              <p className="text-sm font-semibold">Organic Bananas — $1.49/lb</p>
            </div>
          </div>
          <div className="mt-4 md:hidden">
            <DeliveryChecker variant="compact" />
          </div>
        </div>
      </div>
      <div className="container-page hidden pb-10 md:block">
        <DeliveryChecker variant="compact" />
      </div>
    </section>
  );
}
