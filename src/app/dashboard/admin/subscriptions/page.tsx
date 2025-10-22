
'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SubscriptionTier } from "@/lib/types";
import { formatCurrency } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Check, Pencil } from "lucide-react";
import Link from "next/link";
import { useCollection, collection, useFirestore, query, orderBy } from "@/firebase";

export default function AdminSubscriptionsPage() {
  const firestore = useFirestore();
  const tiersQuery = useMemo(() => {
    return firestore ? query(collection(firestore, 'subscriptionTiers'), orderBy('order')) : null;
  }, [firestore]);
  const { data: currentTiers, loading } = useCollection<SubscriptionTier>(tiersQuery);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Suscripciones</h1>
          <p className="text-muted-foreground">
            Visualiza y gestiona los planes de suscripción y sus límites.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/subscriptions/edit">
            <Pencil className="mr-2 h-4 w-4" />
            Editar Planes
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Planes de Suscripción para Subastas</CardTitle>
          <CardDescription>
            Estos planes definen los límites de puja para los usuarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Cargando planes...</p>}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(currentTiers || []).map((tier) => (
                <Card key={tier.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{tier.name}</span>
                      {tier.name === 'Gratis' ? (
                        <Badge variant="secondary">Default</Badge>
                      ) : (
                        <Badge variant="default" className="bg-primary">{formatCurrency(tier.price)}/mes</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {tier.maxBidding === Infinity || tier.maxBidding > 999999999
                        ? "Puja máxima ilimitada"
                        : `Puja máxima: ${formatCurrency(tier.maxBidding)}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Características:</p>
                      <ul className="space-y-2">
                          {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                          </li>
                          ))}
                      </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
