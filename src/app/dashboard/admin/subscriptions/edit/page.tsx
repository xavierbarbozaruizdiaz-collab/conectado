
'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubscriptionTier } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCollection, collection, useFirestore, query, orderBy, doc, writeBatch } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function EditSubscriptionsPage() {
  const firestore = useFirestore();
  const tiersQuery = useMemo(() => {
    return firestore ? query(collection(firestore, 'subscriptionTiers'), orderBy('order')) : null;
  }, [firestore]);
  const { data: initialTiers, loading } = useCollection<SubscriptionTier>(tiersQuery);
  
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (initialTiers) {
      setTiers(initialTiers);
    }
  }, [initialTiers]);

  const handleTierChange = (tierId: string, field: keyof SubscriptionTier, value: string | number) => {
    setTiers(prevTiers =>
      prevTiers.map(tier =>
        tier.id === tierId ? { ...tier, [field]: value } : tier
      )
    );
  };
  
  const handleFeatureChange = (tierId: string, featureIndex: number, value: string) => {
    setTiers(prevTiers =>
      prevTiers.map(tier =>
        tier.id === tierId
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
  
  const addFeature = (tierId: string) => {
    setTiers(prevTiers =>
      prevTiers.map(tier =>
        tier.id === tierId ? { ...tier, features: [...tier.features, ''] } : tier
      )
    );
  };
  
  const removeFeature = (tierId: string, featureIndex: number) => {
     setTiers(prevTiers =>
      prevTiers.map(tier =>
        tier.id === tierId
          ? {
              ...tier,
              features: tier.features.filter((_, index) => index !== featureIndex),
            }
          : tier
      )
    );
  };

  const handleSave = async () => {
    if (!firestore) return;
    setIsSaving(true);
    
    try {
        const batch = writeBatch(firestore);
        tiers.forEach(tier => {
            const { id, ...tierData } = tier;
            // Handle Infinity case for Firestore
            if (tierData.maxProducts === Infinity) {
                tierData.maxProducts = 1.7976931348623157e+308; // Max number in JS
            }
            const docRef = doc(firestore, 'subscriptionTiers', id!);
            batch.set(docRef, tierData);
        });
        await batch.commit();

        toast({
            title: "Planes guardados",
            description: "Los cambios en los planes de suscripción han sido guardados.",
        });
        router.push('/dashboard/admin/subscriptions');
    } catch (error) {
        console.error("Failed to save tiers to Firestore", error);
        const permissionError = new FirestorePermissionError({
            path: 'subscriptionTiers',
            operation: 'write'
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudieron guardar los cambios. Revisa la consola para más detalles."
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  if (loading) {
      return <p>Cargando planes para edición...</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Editar Planes de Suscripción</h1>
        <p className="text-muted-foreground">
          Modifica los detalles de cada plan de suscripción.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 items-start">
        {tiers.map(tier => (
          <Card key={tier.id}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={`price-${tier.id}`}>Precio (Gs. / mes)</Label>
                <Input
                  id={`price-${tier.id}`}
                  type="number"
                  value={tier.price}
                  onChange={(e) => handleTierChange(tier.id!, 'price', Number(e.target.value))}
                  disabled={tier.name === 'Gratis'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`maxProducts-${tier.id}`}>Nº Máx. de Productos</Label>
                <Input
                  id={`maxProducts-${tier.id}`}
                  type="number"
                  value={tier.maxProducts === Infinity || tier.maxProducts > 99999 ? '' : tier.maxProducts}
                  placeholder="Ilimitado"
                  onChange={(e) => {
                    const value = e.target.value;
                    handleTierChange(tier.id!, 'maxProducts', value === '' ? Infinity : Number(value))
                  }}
                />
                 <p className="text-xs text-muted-foreground">Dejar en blanco para productos ilimitados.</p>
              </div>
              <div className="space-y-4">
                <Label>Características</Label>
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(tier.id!, index, e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeFeature(tier.id!, index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addFeature(tier.id!)}>
                  Añadir Característica
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={isSaving || loading}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}
