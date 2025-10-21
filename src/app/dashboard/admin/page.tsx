
'use client';

import React from "react";
import StatCard from "@/components/stat-card";
import {
  DollarSign,
  Users,
  Package,
  Activity,
  CreditCard,
} from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";
import { useCollection, collection, useFirestore } from '@/firebase';
import type { Product, UserProfile, Order } from '@/lib/types';


export default function AdminDashboardPage() {
  const firestore = useFirestore();
  
  const { data: products, loading: productsLoading } = useCollection<Product>(
    firestore ? collection(firestore, 'products') : null
  );
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(
    firestore ? collection(firestore, 'users') : null
  );
  const { data: orders, loading: ordersLoading } = useCollection<Order>(
      firestore ? collection(firestore, 'orders') : null
  );

  const recentUsers = (users || []).slice(0, 5);
  const recentProducts = (products || []).slice(0, 5);

  const totalRevenue = (orders || []).reduce((sum, order) => sum + order.totalAmount, 0);
  const totalSales = orders?.length || 0;
  
  const loading = productsLoading || usersLoading || ordersLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Panel de Administrador</h1>
        <p className="text-muted-foreground">
          Una vista general de la actividad de la plataforma.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          value={loading ? "Cargando..." : formatCurrency(totalRevenue)}
          icon={DollarSign}
          description="Ingresos de todos los tiempos"
        />
        <StatCard
          title="Usuarios Totales"
          value={loading ? "Cargando..." : (users?.length || 0).toString()}
          icon={Users}
          description="Usuarios registrados"
        />
        <StatCard
          title="Productos Totales"
          value={loading ? "Cargando..." : (products?.length || 0).toString()}
          icon={Package}
          description="En toda la plataforma"
        />
        <StatCard
          title="Ventas Totales"
          value={loading ? "Cargando..." : totalSales.toString()}
          icon={CreditCard}
          description="Pedidos completados y pendientes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
            <CardDescription>
              Los últimos usuarios que se han registrado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tienda</TableHead>
                  <TableHead>ID de Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}><TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse" /></TableCell><TableCell><div className="h-4 bg-muted rounded w-full animate-pulse" /></TableCell></TableRow>
                )) : recentUsers.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.storeName}</TableCell>
                    <TableCell>{user.uid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos Recientes</CardTitle>
            <CardDescription>
              Los últimos productos añadidos a la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {loading ? Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}><TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse" /></TableCell><TableCell><div className="h-4 bg-muted rounded w-1/2 animate-pulse" /></TableCell><TableCell><div className="h-4 bg-muted rounded w-1/4 animate-pulse" /></TableCell></TableRow>
                )) : recentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {(users || []).find(u => u.uid === product.sellerId)?.storeName}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
