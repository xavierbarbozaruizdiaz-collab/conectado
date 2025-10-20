import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { subscriptionTiers } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Elige tu Plan
        </h1>
        <p className="text-lg text-muted-foreground">
          Desbloquea más funciones y haz crecer tu tienda con nuestros flexibles niveles de suscripción. Cancela en cualquier momento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {subscriptionTiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              "flex flex-col",
              tier.name === "Silver" && "border-primary shadow-primary/20 shadow-lg"
            )}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">{tier.name}</CardTitle>
              <CardDescription>Puja Máxima: {formatCurrency(tier.maxBidding)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold">{formatCurrency(tier.price)}</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                variant={tier.name === "Silver" ? "default" : "outline"}
              >
                Elegir {tier.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
