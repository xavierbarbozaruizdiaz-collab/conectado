import StatCard from "@/components/stat-card";
import {
  DollarSign,
  Package,
  CreditCard,
  CircleHelp,
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
import { products } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const sellerProducts = products.filter(p => p.sellerId === 'user1');

export default function SellerDashboardPage() {
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
          value="Gs. 45.231.890"
          icon={DollarSign}
          description="+20.1% desde el mes pasado"
        />
        <StatCard
          title="Ventas"
          value="+12.234"
          icon={CreditCard}
          description="+19% desde el mes pasado"
        />
        <StatCard
          title="Saldo Pendiente"
          value="Gs. 2.350.000"
          icon={CircleHelp}
          description="Esperando pago"
        />
        <StatCard
          title="Productos Totales"
          value="57"
          icon={Package}
          description="2 productos necesitan atención"
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
                {sellerProducts.slice(0, 5).map((product) => (
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
                 <Link href="/store/user1">
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
