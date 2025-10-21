
'use client';

import { useMemo } from 'react';
import StatCard from "@/components/stat-card";
import {
  DollarSign,
  Users,
  MousePointerClick,
  BadgePercent,
  Link as LinkIcon,
  Tag
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useUser, useFirestore, useCollection, collection, query, where } from "@/firebase";
import { useDoc, docRef } from "@/firebase/firestore/use-doc";
import { updateDoc } from 'firebase/firestore';
import type { Affiliate, AffiliateEvent } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pagado':
      return <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Pagado</Badge>;
    case 'Pendiente':
      return <Badge variant="outline">Pendiente</Badge>;
    case 'Procesando':
        return <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">Procesando</Badge>;
    case 'Rechazado':
      return <Badge variant="destructive">Rechazado</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};


export default function AffiliateDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const affiliateDocRef = user && firestore ? docRef(firestore, "affiliates", user.uid) : null;
  const { data: affiliate, loading: affiliateLoading } = useDoc<Affiliate>(affiliateDocRef);
  
  const eventsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'affiliateEvents'), where('affiliateId', '==', user.uid));
  }, [user, firestore]);
  const { data: events, loading: eventsLoading } = useCollection<AffiliateEvent>(eventsQuery);

  const { totalClicks, totalConversions } = useMemo(() => {
    if (!events) return { totalClicks: 0, totalConversions: 0 };
    return events.reduce((acc, event) => {
        if (event.type === 'click') acc.totalClicks++;
        if (event.type === 'conversion') acc.totalConversions++;
        return acc;
    }, { totalClicks: 0, totalConversions: 0 });
  }, [events]);

  const handleRequestPayout = () => {
    if (!affiliateDocRef || !affiliate || affiliate.pendingBalance <= 0) return;

    const amountToRequest = affiliate.pendingBalance;

    const newPaymentRequest = {
      id: `pay_req_${new Date().getTime()}`,
      date: new Date().toISOString().split('T')[0],
      amount: amountToRequest,
      status: 'Pendiente' as const,
      method: 'Transferencia Bancaria', // Default method
    };

    const updatedPaymentHistory = [...(affiliate.paymentHistory || []), newPaymentRequest];
    const updatedData = {
        paymentHistory: updatedPaymentHistory,
        pendingBalance: 0,
    };

    updateDoc(affiliateDocRef, updatedData)
        .then(() => {
            toast({
                title: 'Solicitud Enviada',
                description: `Tu solicitud de pago por ${formatCurrency(amountToRequest)} ha sido enviada.`,
            });
        })
        .catch(e => {
             const permissionError = new FirestorePermissionError({
                path: affiliateDocRef.path,
                operation: 'update',
                requestResourceData: updatedData
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const loading = affiliateLoading || eventsLoading;

  if (loading) {
    return <div>Cargando tu panel de afiliado...</div>
  }

  if (!affiliate) {
    // TODO: Add a component to allow user to register as an affiliate
    return <div>No se encontró información de afiliado para tu cuenta.</div>
  }
  
  const totalPaid = (affiliate.totalEarnings || 0) - (affiliate.pendingBalance || 0);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Panel de Afiliados</h1>
        <p className="text-muted-foreground">Rastrea tus referidos y ganancias.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Clics Totales"
          value={loading ? "Cargando..." : totalClicks.toString()}
          icon={MousePointerClick}
          description="Clics en tus enlaces"
        />
        <StatCard
          title="Conversiones"
          value={loading ? "Cargando..." : totalConversions.toString()}
          icon={Users}
          description="Ventas generadas"
        />
        <StatCard
          title="Tasa de Conversión"
          value={loading ? "Cargando..." : `${totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0}%`}
          icon={BadgePercent}
          description="Clics que se vuelven ventas"
        />
        <StatCard
          title="Comisión Total"
          value={loading ? "Cargando..." : formatCurrency(affiliate.totalEarnings || 0)}
          icon={DollarSign}
          description="Ganancias de todos los tiempos"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Herramientas de Marketing y Referidos</CardTitle>
            <CardDescription>Genera enlaces y rastrea tus campañas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2"><LinkIcon className="w-4 h-4"/> Tu Enlace de Referido</label>
              <div className="flex gap-2">
                <Input readOnly value={`https://mercadito.online/?ref=${affiliate.affiliateCode}`} />
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(`https://mercadito.online/?ref=${affiliate.affiliateCode}`)}>Copiar</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2"><Tag className="w-4 h-4"/> Etiqueta de Campaña (Opcional)</label>
              <div className="flex gap-2">
                <Input placeholder="ej., promo_redessociales" />
                <Button>Generar Enlace</Button>
              </div>
              <p className="text-xs text-muted-foreground">Añade una etiqueta para rastrear el rendimiento de campañas específicas.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Total Generado</span>
                <span className="font-bold text-lg">{formatCurrency(affiliate.totalEarnings || 0)}</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Total Pagado</span>
                <span className="font-bold text-lg">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between items-baseline text-primary">
                <span >Saldo Pendiente</span>
                <span className="font-bold text-lg">{formatCurrency(affiliate.pendingBalance || 0)}</span>
            </div>
            <Button className="w-full" onClick={handleRequestPayout} disabled={(affiliate.pendingBalance || 0) <= 0}>Solicitar Pago</Button>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Un registro de tus pagos anteriores.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                   <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliate.paymentHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

    </div>
  );
}
