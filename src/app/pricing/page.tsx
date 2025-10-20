
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { subscriptionTiers as initialTiers, SubscriptionTier } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

const TIERS_STORAGE_KEY = 'subscriptionTiers';

export default function PricingPage() {
  const [currentTiers, setCurrentTiers] = useState<SubscriptionTier[]>(initialTiers);

  useEffect(() => {
    const savedTiers = localStorage.getItem(TIERS_STORAGE_KEY);
    if (savedTiers) {
      setCurrentTiers(JSON.parse(savedTiers));
    }
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {currentTiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              "flex flex-col",
              tier.name === "Plata" && "border-primary shadow-primary/20 shadow-lg"
            )}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">{tier.name}</CardTitle>
              <CardDescription>
                {tier.maxBidding === Infinity
                  ? "Puja sin límites"
                  : `Puja Máxima: ${formatCurrency(tier.maxBidding)}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold">
                  {tier.price === 0 ? "Gratis" : formatCurrency(tier.price)}
                </span>
                {tier.price > 0 && <span className="text-muted-foreground">/mes</span>}
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
                variant={tier.name === "Plata" ? "default" : "outline"}
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
