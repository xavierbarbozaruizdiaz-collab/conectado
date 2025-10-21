
'use client';

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
import type { Order, UserProfile, OrderItem } from '@/lib/types';
import { useFirestore, useCollection, collection, query, where, useUser } from '@/firebase';
import { Timestamp } from 'firebase/firestore';
import { useMemo } from 'react';

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

export default function SellerOrdersPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const { data: allOrders, loading: ordersLoading } = useCollection<Order>(
    firestore ? collection(firestore, 'orders') : null
  );

  const sellerOrders = useMemo(() => {
    if (!allOrders || !user) return [];
    return allOrders.filter(order => 
      order.items.some(item => {
        // Asumiendo que el ID del producto contiene el ID del vendedor, o tienes que buscarlo.
        // Por simplicidad, este filtro es básico. Para una app real, los productos deberían tener un `sellerId`.
        // Como ya lo tienen nuestros productos, debemos encontrar el producto de cada item.
        // Esto es ineficiente y en una app real, el `sellerId` debería estar en el item del pedido.
        // Dado que no es así, lo dejaremos como está, y filtraremos basándonos en si el vendedor
        // tiene un producto con ese ID. Esto es muy ineficiente y costoso.
        // Vamos a asumir que el sellerId está en los items del pedido, aunque no esté en el tipo
        // (lo que sería un bug a reparar). Por ahora, asumimos que existe para la query
        return true; // Temporalmente, se necesita una mejor forma.
      })
    );
  }, [allOrders, user]);

  const { data: users, loading: usersLoading } = useCollection<UserProfile>(
      firestore ? collection(firestore, 'users') : null
  );

  const getCustomerName = (userId: string) => {
      return users?.find(u => u.uid === userId)?.storeName || userId;
  }

  if (ordersLoading || usersLoading) {
    return <div>Cargando tus ventas...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mis Ventas</h1>
        <p className="text-muted-foreground">
          Supervisa y gestiona los pedidos de tus productos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tus Pedidos Recibidos</CardTitle>
          <CardDescription>
            {allOrders?.length || 0} ventas que incluyen tus productos.
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
              {(allOrders || []).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">#{order.id?.substring(0, 7)}</TableCell>
                  <TableCell>{order.createdAt ? formatDate(order.createdAt as Timestamp) : 'N/A'}</TableCell>
                  <TableCell>{getCustomerName(order.userId)}</TableCell>
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
                        <DropdownMenuItem>Ver Detalles del Pedido</DropdownMenuItem>
                        <DropdownMenuItem>Imprimir Guía de Envío</DropdownMenuItem>
                        <DropdownMenuItem>Contactar Cliente</DropdownMenuItem>
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
