
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Banknote, CreditCard, Landmark, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from "@/firebase";
import { useDoc, docRef } from "@/firebase/firestore/use-doc";
import { updateDoc } from 'firebase/firestore';
import type { Affiliate } from '@/lib/types';
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


export default function AffiliatePaymentsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const affiliateDocRef = user && firestore ? docRef(firestore, "affiliates", user.uid) : null;
  const { data: affiliate, loading } = useDoc<Affiliate>(affiliateDocRef);
  
  const minimumPayout = 100000;
  
  const handleRequestPayout = () => {
    if (!affiliateDocRef || !affiliate || affiliate.pendingBalance < minimumPayout) return;
    
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
  
  if (loading) {
      return <div>Cargando...</div>;
  }
  
  if (!affiliate) {
      return <div>No se encontró información de afiliado.</div>;
  }
  
  const pendingBalance = affiliate.pendingBalance || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Pagos de Afiliado</h1>
        <p className="text-muted-foreground">
          Gestiona tu saldo y solicita tus pagos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card>
              <CardHeader>
                <CardTitle>Solicitar un Pago</CardTitle>
                <CardDescription>Revisa tu saldo y solicita el pago de tus comisiones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Saldo Pendiente</div>
                        <div className="text-3xl font-bold text-primary">{formatCurrency(pendingBalance)}</div>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Mínimo para Pago</div>
                        <div className="text-3xl font-bold">{formatCurrency(minimumPayout)}</div>
                    </div>
                </div>

                {pendingBalance < minimumPayout && (
                     <div className="flex items-center gap-3 text-sm text-destructive border border-destructive/50 rounded-lg p-3">
                        <AlertTriangle className="h-5 w-5"/>
                        <p>Necesitas alcanzar el monto mínimo de pago para poder solicitar tus ganancias.</p>
                     </div>
                )}
               
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button size="lg" className="w-full" disabled={pendingBalance < minimumPayout}>
                            <Banknote className="mr-2 h-5 w-5" />
                            Solicitar Pago de {formatCurrency(pendingBalance)}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmas la solicitud de pago?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se solicitará un pago por un total de{' '}
                            <span className="font-bold text-primary">{formatCurrency(pendingBalance)}</span>.
                            Este monto se enviará a tu método de pago configurado.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRequestPayout}>Confirmar y Solicitar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Solicitudes de Pago</CardTitle>
                <CardDescription>Un registro de todas tus solicitudes de pago y sus estados.</CardDescription>
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
                    {affiliate.paymentHistory.map((payment) => (
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
        
        <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>Configura cómo quieres recibir tus pagos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-14">
                    <Landmark className="mr-4"/>
                    <div>
                        <div className="font-semibold">Transferencia Bancaria</div>
                        <div className="text-xs text-muted-foreground text-left">Configurar datos bancarios</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-14">
                    <CreditCard className="mr-4"/>
                    <div>
                        <div className="font-semibold">PayPal</div>
                        <div className="text-xs text-muted-foreground text-left">Configurar cuenta de PayPal</div>
                    </div>
                  </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
