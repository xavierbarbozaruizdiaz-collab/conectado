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

export default function AffiliateDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Panel de Afiliados</h1>
        <p className="text-muted-foreground">Rastrea tus referidos y ganancias.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Clics Totales"
          value="12.832"
          icon={MousePointerClick}
          description="+15% desde el mes pasado"
        />
        <StatCard
          title="Registros"
          value="1.204"
          icon={Users}
          description="+8% desde el mes pasado"
        />
        <StatCard
          title="Ventas"
          value="458"
          icon={DollarSign}
          description="+12% desde el mes pasado"
        />
        <StatCard
          title="Comisión"
          value="Gs. 1.289.400"
          icon={BadgePercent}
          description="Ganancias totales este mes"
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
                <Input readOnly value="https://mercadito.online/?ref=aff123" />
                <Button variant="outline">Copiar</Button>
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
                <span className="font-bold text-lg">Gs. 5.670.500</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Total Pagado</span>
                <span className="font-bold text-lg">Gs. 4.100.000</span>
            </div>
            <div className="flex justify-between items-baseline text-primary">
                <span >Saldo Pendiente</span>
                <span className="font-bold text-lg">Gs. 1.570.500</span>
            </div>
            <Button className="w-full">Solicitar Pago</Button>
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
                  <TableHead>Estado</TableHead>
                  <TableHead>ID de Transacción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-10-05</TableCell>
                  <TableCell>Gs. 500.000</TableCell>
                  <TableCell><Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Pagado</Badge></TableCell>
                  <TableCell>txn_123abc</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-09-05</TableCell>
                  <TableCell>Gs. 450.000</TableCell>
                  <TableCell><Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Pagado</Badge></TableCell>
                  <TableCell>txn_456def</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>2023-08-05</TableCell>
                  <TableCell>Gs. 550.000</TableCell>
                  <TableCell><Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Pagado</Badge></TableCell>
                  <TableCell>txn_789ghi</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

    </div>
  );
}
