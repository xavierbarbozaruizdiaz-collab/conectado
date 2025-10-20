import StatCard from "@/components/stat-card";
import {
  DollarSign,
  Package,
  CreditCard,
  CircleHelp,
  Plus,
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

const sellerProducts = products.filter(p => p.sellerId === 'user1');

export default function SellerDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Panel de Vendedor</h1>
          <p className="text-muted-foreground">Bienvenido de nuevo, aquí está tu resumen de ventas.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Producto
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
            <CardTitle>Historial de Productos</CardTitle>
            <CardDescription>Una lista de tus productos recientes.</CardDescription>
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
            <CardTitle>Personalizar Tienda</CardTitle>
            <CardDescription>
              Actualiza la apariencia e información de tu tienda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="storeName" className="text-sm font-medium">Nombre de la Tienda</label>
              <input id="storeName" defaultValue="Vintage Finds" className="w-full p-2 border rounded-md bg-transparent" />
            </div>
            <div className="space-y-2">
              <label htmlFor="storeDesc" className="text-sm font-medium">Descripción de la Tienda</label>
              <textarea id="storeDesc" defaultValue="Colección curada de vintage..." className="w-full p-2 border rounded-md bg-transparent min-h-[100px]" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Foto de Perfil y Banner</label>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Subir Foto</Button>
                    <Button variant="outline" className="flex-1">Subir Banner</Button>
                </div>
            </div>
            <Button className="w-full">Guardar Cambios</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
