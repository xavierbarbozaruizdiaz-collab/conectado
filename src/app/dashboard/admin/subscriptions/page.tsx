import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { subscriptionTiers } from "@/lib/data";
import { formatCurrency } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Pencil } from "lucide-react";
import Link from "next/link";

export default function AdminSubscriptionsPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTiers.map((tier) => (
              <Card key={tier.name} className="flex flex-col">
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
                    {tier.maxBidding === Infinity
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
        </CardContent>
      </Card>
    </div>
  );
}
