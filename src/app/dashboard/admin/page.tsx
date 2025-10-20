import React from "react";
import StatCard from "@/components/stat-card";
import {
  DollarSign,
  Users,
  Package,
  Activity,
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
import { products, users } from "@/lib/data";

export default function AdminDashboardPage() {
  const recentUsers = users.slice(0, 5);
  const recentProducts = products.slice(0, 5);

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
          value={formatCurrency(125430500)}
          icon={DollarSign}
          description="Ingresos de todos los tiempos"
        />
        <StatCard
          title="Usuarios Totales"
          value={users.length.toString()}
          icon={Users}
          description="+10% este mes"
        />
        <StatCard
          title="Productos Totales"
          value={products.length.toString()}
          icon={Package}
          description="En toda la plataforma"
        />
        <StatCard
          title="Ventas del Mes"
          value="1.284"
          icon={Activity}
          description="+5% vs el mes pasado"
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
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.storeName}</TableCell>
                    <TableCell>{user.id}</TableCell>
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
                {recentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {users.find(u => u.id === product.sellerId)?.storeName}
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
