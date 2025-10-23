
'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Order, UserProfile } from '@/lib/types';
import { useFirestore, useCollection, collection } from '@/firebase';
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Entregado':
      return <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">{status}</Badge>;
    case 'Pendiente':
      return <Badge variant="outline">{status}</Badge>;
    case 'Procesado':
    case 'Enviado':
        return <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">{status}</Badge>;
    case 'Cancelado':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const formatDate = (timestamp: Timestamp | Date) => {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat('es-PY', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const ordersQuery = useMemo(() => {
    return firestore ? collection(firestore, 'orders') : null;
  }, [firestore]);
  const { data: orders, loading: ordersLoading } = useCollection<Order>(ordersQuery);

  const usersQuery = useMemo(() => {
    return firestore ? collection(firestore, 'users') : null;
  }, [firestore]);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const getUserName = (userId: string) => {
      return users?.find(u => u.uid === userId)?.storeName || userId;
  }

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'orders', orderId);
    updateDoc(orderRef, { status })
      .then(() => {
        toast({
          title: "Estado actualizado",
          description: `El pedido ha sido marcado como "${status}".`
        });
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: orderRef.path,
          operation: 'update',
          requestResourceData: { status }
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (ordersLoading || usersLoading) {
    return <div>Cargando pedidos...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <p className="text-muted-foreground">
          Supervisa todos los pedidos realizados en la plataforma.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Pedidos</CardTitle>
          <CardDescription>
            {orders?.length || 0} pedidos en total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(orders || []).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">#{order.id?.substring(0, 7)}</TableCell>
                  <TableCell>{order.createdAt ? formatDate(order.createdAt as Timestamp) : 'N/A'}</TableCell>
                  <TableCell>{getUserName(order.userId)}</TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id!, 'Procesado')}>
                          Marcar como Procesando
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id!, 'Enviado')}>
                          Marcar como Enviado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id!, 'Entregado')}>
                          Marcar como Entregado
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(order.id!, 'Cancelado')}>
                          Cancelar Pedido
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
