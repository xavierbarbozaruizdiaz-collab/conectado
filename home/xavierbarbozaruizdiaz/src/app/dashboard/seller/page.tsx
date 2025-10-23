
'use client';

import { useMemo } from 'react';
import StatCard from "@/components/stat-card";
import {
  DollarSign,
  Package,
  CreditCard,
  Wallet,
  Plus,
  Settings
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
import { Badge } from "@/components/ui/badge";
import { useCollection, collection, useFirestore, useUser, query, where } from '@/firebase';
import type { Product, Order } from '@/lib/types';
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function SellerDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const productsQuery = user && firestore ? query(collection(firestore, "products"), where("sellerId", "==", user.uid)) : null;
  const { data: sellerProducts, loading: productsLoading } = useCollection<Product>(productsQuery);

  const ordersQuery = user && firestore ? query(collection(firestore, 'orders')) : null;
  const { data: allOrders, loading: ordersLoading } = useCollection<Order>(ordersQuery);

  const { totalRevenue, totalSales, pendingBalance } = useMemo(() => {
    if (!allOrders || !user) return { totalRevenue: 0, totalSales: 0, pendingBalance: 0 };
    
    let revenue = 0;
    let salesCount = 0;
    
    const sellerOrders = allOrders.filter(order => 
      order.items.some(item => item.sellerId === user.uid)
    );
    
    sellerOrders.forEach(order => {
      const sellerItemsInOrder = order.items.filter(item => item.sellerId === user.uid);
      const revenueFromOrder = sellerItemsInOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      revenue += revenueFromOrder;
      salesCount++; 
    });

    const unpaidRevenue = sellerOrders
      .filter(o => o.status !== 'Entregado' && o.status !== 'Cancelado')
      .reduce((sum, order) => {
          const itemsValue = order.items
            .filter(item => item.sellerId === user.uid)
            .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
          return sum + itemsValue;
      }, 0);


    return { totalRevenue: revenue, totalSales: salesCount, pendingBalance: unpaidRevenue };

  }, [allOrders, user]);

  const loading = productsLoading || ordersLoading;

  if (loading) {
    return <div>Cargando tu resumen de ventas...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Panel de Vendedor</h1>
          <p className="text-muted-foreground">Bienvenido de nuevo, aquí está tu resumen de ventas.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/seller/add-product">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Producto
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          value={loading ? "Cargando..." : formatCurrency(totalRevenue)}
          icon={DollarSign}
          description="Ingresos brutos de todos los tiempos"
        />
        <StatCard
          title="Ventas"
          value={loading ? "Cargando..." : totalSales.toString()}
          icon={CreditCard}
          description="Número total de órdenes"
        />
        <StatCard
          title="Saldo Pendiente"
          value={loading ? "Cargando..." : formatCurrency(pendingBalance)}
          icon={Wallet}
          description="Pagos por procesar"
        />
        <StatCard
          title="Productos Totales"
          value={sellerProducts?.length.toString() || '0'}
          icon={Package}
          description="Tus productos activos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Productos Recientes</CardTitle>
            <CardDescription>Una lista de tus productos añadidos recientemente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(sellerProducts || []).slice(0, 5).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === 'Activo' ? 'default' :
                          product.status === 'Vendido' ? 'secondary' : 'outline'
                        }
                        className={product.status === 'Activo' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : ''}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      {product.isAuction ? "Subasta" : "Venta Directa"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tu tienda rápidamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline">
                 <Link href="/dashboard/seller/add-product">
                    <Plus className="mr-2"/> Añadir Nuevo Producto
                 </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                 <Link href="/dashboard/seller/settings">
                    <Settings className="mr-2"/> Configuración de la Tienda
                 </Link>
              </Button>
               <Button asChild className="w-full justify-start" variant="outline">
                 <Link href={`/store/${user?.uid}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 18a10 10 0 0 0-3.5 1.83"/><path d="M12 18a10 10 0 0 1-3.5 1.83"/><path d="M22 12a10 10 0 0 0-20 0"/><path d="M12 2a10 10 0 0 1 3.5 1.83"/><path d="M12 2a10 10 0 0 0 3.5 1.83"/></svg>
                     Ver Tienda Pública
                 </Link>
              </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
