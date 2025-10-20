
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [directSaleCommission, setDirectSaleCommission] = useState(10);
  const [auctionSellerCommission, setAuctionSellerCommission] = useState(12.5);
  const [auctionBuyerCommission, setAuctionBuyerCommission] = useState(12.5);
  const [affiliateShare, setAffiliateShare] = useState(25);

  const handleSave = () => {
    // In a real app, you would save these settings to a database.
    console.log({
      directSaleCommission,
      auctionSellerCommission,
      auctionBuyerCommission,
      affiliateShare,
    });
    toast({
      title: "Configuración guardada",
      description: "Los porcentajes de comisión han sido actualizados.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configuración General</h1>
        <p className="text-muted-foreground">
          Gestiona las comisiones de la plataforma y la configuración del programa de afiliados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comisiones de la Plataforma</CardTitle>
          <CardDescription>
            Define los porcentajes que la plataforma cobra por las transacciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="direct-sale-commission">Comisión por Venta Directa</Label>
            <div className="flex items-center gap-2">
              <Input
                id="direct-sale-commission"
                type="number"
                value={directSaleCommission}
                onChange={(e) => setDirectSaleCommission(Number(e.target.value))}
                min="0"
                max="100"
                className="w-24"
              />
              <span className="text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Porcentaje cobrado al vendedor en cada venta directa.
            </p>
          </div>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="auction-seller-commission">Comisión al Vendedor por Subasta</Label>
            <div className="flex items-center gap-2">
              <Input
                id="auction-seller-commission"
                type="number"
                value={auctionSellerCommission}
                onChange={(e) => setAuctionSellerCommission(Number(e.target.value))}
                min="0"
                max="100"
                className="w-24"
              />
              <span className="text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Porcentaje cobrado al vendedor sobre el precio final de la subasta.
            </p>
          </div>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="auction-buyer-commission">Comisión al Comprador por Subasta</Label>
            <div className="flex items-center gap-2">
              <Input
                id="auction-buyer-commission"
                type="number"
                value={auctionBuyerCommission}
                onChange={(e) => setAuctionBuyerCommission(Number(e.target.value))}
                min="0"
                max="100"
                className="w-24"
              />
              <span className="text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Porcentaje extra cobrado al comprador sobre el precio final de la subasta.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Configuración del Programa de Afiliados</CardTitle>
            <CardDescription>Define qué parte de la comisión de la plataforma se comparte con el afiliado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2 max-w-sm">
                <Label htmlFor="affiliate-share" className="flex items-center">
                    <Percent className="w-4 h-4 mr-2"/>
                    Reparto con Afiliados
                </Label>
                <div className="flex items-center gap-2">
                    <Input 
                        id="affiliate-share" 
                        type="number" 
                        value={affiliateShare}
                        onChange={(e) => setAffiliateShare(Number(e.target.value))}
                        className="w-24"
                        min="0"
                        max="100"
                    />
                    <span className="text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">El porcentaje de la comisión de la plataforma que se pagará al afiliado.</p>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>Guardar Toda la Configuración</Button>
      </div>
    </div>
  );
}
