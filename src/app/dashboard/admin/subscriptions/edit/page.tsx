
'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { subscriptionTiers as initialTiers } from "@/lib/data";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export default function EditSubscriptionsPage() {
  const [tiers, setTiers] = useState(initialTiers);
  const { toast } = useToast();

  const handleTierChange = (tierName: string, field: string, value: string | number) => {
    setTiers(prevTiers =>
      prevTiers.map(tier =>
        tier.name === tierName ? { ...tier, [field]: value } : tier
      )
    );
  };
  
  const handleFeatureChange = (tierName: string, featureIndex: number, value: string) => {
    setTiers(prevTiers =>
      prevTiers.map(tier =>
        tier.name === tierName
          ? {
              ...tier,
              features: tier.features.map((feature, index) =>
                index === featureIndex ? value : feature
              ),
            }
          : tier
      )
    );
  };
  
  const addFeature = (tierName: string) => {
    setTiers(prevTiers =>
      prevTiers.map(tier =>
        tier.name === tierName ? { ...tier, features: [...tier.features, ''] } : tier
      )
    );
  };
  
  const removeFeature = (tierName: string, featureIndex: number) => {
     setTiers(prevTiers =>
      prevTiers.map(tier =>
        tier.name === tierName
          ? {
              ...tier,
              features: tier.features.filter((_, index) => index !== featureIndex),
            }
          : tier
      )
    );
  };

  const handleSave = () => {
    // In a real app, you would save this data to your database.
    console.log("Saving tiers:", tiers);
    toast({
      title: "Planes guardados",
      description: "Los cambios en los planes de suscripción han sido guardados.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Editar Planes de Suscripción</h1>
        <p className="text-muted-foreground">
          Modifica los detalles de cada plan de suscripción.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {tiers.map(tier => (
          <Card key={tier.name}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={`price-${tier.name}`}>Precio (Gs. / mes)</Label>
                <Input
                  id={`price-${tier.name}`}
                  type="number"
                  value={tier.price}
                  onChange={(e) => handleTierChange(tier.name, 'price', Number(e.target.value))}
                  disabled={tier.name === 'Gratis'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`maxBidding-${tier.name}`}>Puja Máxima (Gs.)</Label>
                <Input
                  id={`maxBidding-${tier.name}`}
                  type="number"
                  value={tier.maxBidding === Infinity ? '' : tier.maxBidding}
                  placeholder={tier.maxBidding === Infinity ? 'Ilimitado' : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleTierChange(tier.name, 'maxBidding', value === '' ? Infinity : Number(value))
                  }}
                />
                 <p className="text-xs text-muted-foreground">Dejar en blanco para puja ilimitada.</p>
              </div>
              <div className="space-y-4">
                <Label>Características</Label>
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(tier.name, index, e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeFeature(tier.name, index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addFeature(tier.name)}>
                  Añadir Característica
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>Guardar Cambios</Button>
      </div>
    </div>
  );
}
