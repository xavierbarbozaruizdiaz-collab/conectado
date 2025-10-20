'use client';

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

const paymentHistory = [
  {
    id: 'pay_req_1',
    date: '2023-10-02',
    amount: 500000,
    status: 'Pagado',
    method: 'Transferencia Bancaria',
    transactionId: 'txn_123abc',
  },
  {
    id: 'pay_req_2',
    date: '2023-09-01',
    amount: 450000,
    status: 'Pagado',
    method: 'Transferencia Bancaria',
    transactionId: 'txn_456def',
  },
  {
    id: 'pay_req_3',
    date: '2023-08-15',
    amount: 250000,
    status: 'Rechazado',
    method: 'PayPal',
    transactionId: 'N/A',
  },
  {
    id: 'pay_req_4',
    date: '2023-08-03',
    amount: 550000,
    status: 'Pagado',
    method: 'Transferencia Bancaria',
    transactionId: 'txn_789ghi',
  },
];

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
  const pendingBalance = 1570500;
  const minimumPayout = 100000;

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
               
                <Button size="lg" className="w-full" disabled={pendingBalance < minimumPayout}>
                    <Banknote className="mr-2 h-5 w-5" />
                    Solicitar Pago de {formatCurrency(pendingBalance)}
                </Button>
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
                       <TableHead>ID de Transacción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
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
