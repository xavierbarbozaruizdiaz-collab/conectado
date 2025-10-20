
"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const performanceData = [
  { date: "2023-10-01", clicks: 120, signups: 15, conversions: 5 },
  { date: "2023-10-02", clicks: 150, signups: 18, conversions: 7 },
  { date: "2023-10-03", clicks: 130, signups: 12, conversions: 4 },
  { date: "2023-10-04", clicks: 180, signups: 25, conversions: 10 },
  { date: "2023-10-05", clicks: 210, signups: 30, conversions: 12 },
  { date: "2023-10-06", clicks: 190, signups: 22, conversions: 9 },
  { date: "2023-10-07", clicks: 250, signups: 35, conversions: 15 },
];

const campaignPerformance = [
    { id: '1', name: 'promo_redessociales', clicks: 1850, signups: 250, conversions: 80, earnings: 450000 },
    { id: '2', name: 'newsletter_octubre', clicks: 950, signups: 120, conversions: 45, earnings: 280000 },
    { id: '3', name: 'blog_review_dron', clicks: 2200, signups: 310, conversions: 110, earnings: 650000 },
    { id: '4', name: 'default', clicks: 832, signups: 90, conversions: 32, earnings: 150000 },
];

const trafficLog = [
    { id: 't1', timestamp: '2023-10-15 10:30 AM', campaign: 'promo_redessociales', converted: true },
    { id: 't2', timestamp: '2023-10-15 10:28 AM', campaign: 'blog_review_dron', converted: false },
    { id: 't3', timestamp: '2023-10-15 10:25 AM', campaign: 'blog_review_dron', converted: true },
    { id: 't4', timestamp: '2023-10-15 10:22 AM', campaign: 'newsletter_octubre', converted: false },
    { id: 't5', timestamp: '2023-10-15 10:19 AM', campaign: 'default', converted: false },
]

export default function AffiliateReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Afiliado</h1>
          <p className="text-muted-foreground">
            Analiza el rendimiento de tus campañas y referidos.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <DateRangePicker />
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4"/>
                Exportar
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento General</CardTitle>
          <CardDescription>
            Un vistazo a tus métricas clave durante el período seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Legend />
              <Bar dataKey="clicks" fill="hsl(var(--primary))" name="Clics" />
              <Bar
                dataKey="signups"
                fill="hsl(var(--chart-2))"
                name="Registros"
              />
              <Bar
                dataKey="conversions"
                fill="hsl(var(--accent))"
                name="Conversiones"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Campaña</CardTitle>
           <CardDescription>
            Compara cómo están funcionando tus diferentes campañas.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre de Campaña</TableHead>
                  <TableHead>Clics</TableHead>
                  <TableHead>Registros</TableHead>
                  <TableHead>Conversiones</TableHead>
                  <TableHead>Ganancias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignPerformance.map(campaign => (
                    <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.clicks}</TableCell>
                        <TableCell>{campaign.signups}</TableCell>
                        <TableCell>{campaign.conversions}</TableCell>
                        <TableCell>{formatCurrency(campaign.earnings)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Registro de Tráfico Reciente</CardTitle>
          <CardDescription>
            Un historial de los clics más recientes de tus enlaces de referido.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Campaña</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trafficLog.map(log => (
                     <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.campaign}</TableCell>
                        <TableCell>
                            {log.converted ? <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Convertido</Badge> : <Badge variant="outline">Clic</Badge>}
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
