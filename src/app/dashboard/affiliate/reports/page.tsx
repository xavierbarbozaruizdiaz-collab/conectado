
"use client";

import { useMemo } from "react";
import { useSearchParams } from 'next/navigation';
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
import { useUser, useFirestore, useCollection, collection, query, where } from "@/firebase";
import type { AffiliateEvent } from "@/lib/types";
import { Timestamp } from "firebase/firestore";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function AffiliateReportsContent() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const firestore = useFirestore();

  // If userId is in params, we're in admin view. Otherwise, it's the affiliate's own view.
  const affiliateId = searchParams.get('userId') || user?.uid;

  const eventsQuery = useMemo(() => {
    if (!affiliateId || !firestore) return null;
    return query(collection(firestore, 'affiliateEvents'), where('affiliateId', '==', affiliateId));
  }, [affiliateId, firestore]);

  const { data: events, loading } = useCollection<AffiliateEvent>(eventsQuery);

  const performanceData = useMemo(() => {
    if (!events) return [];
    
    const dailyData: { [key: string]: { date: string, clicks: number, conversions: number } } = {};

    events.forEach(event => {
      const date = format((event.timestamp as Timestamp).toDate(), 'yyyy-MM-dd');
      if (!dailyData[date]) {
        dailyData[date] = { date, clicks: 0, conversions: 0 };
      }
      if (event.type === 'click') {
        dailyData[date].clicks += 1;
      } else if (event.type === 'conversion') {
        dailyData[date].conversions += 1;
      }
    });

    return Object.values(dailyData).sort((a,b) => a.date.localeCompare(b.date));
  }, [events]);

  const campaignPerformance = useMemo(() => {
    if (!events) return [];

    const campaigns: { [key: string]: { name: string, clicks: number, conversions: number, earnings: number } } = {};

    events.forEach(event => {
      const campaignName = event.campaign || 'default';
      if (!campaigns[campaignName]) {
        campaigns[campaignName] = { name: campaignName, clicks: 0, conversions: 0, earnings: 0 };
      }
      if (event.type === 'click') {
        campaigns[campaignName].clicks += 1;
      } else if (event.type === 'conversion') {
        campaigns[campaignName].conversions += 1;
        campaigns[campaignName].earnings += event.earnings || 0;
      }
    });

    return Object.values(campaigns);
  }, [events]);

  const trafficLog = useMemo(() => {
      if (!events) return [];
      return events
        .filter(e => e.type === 'click')
        .sort((a,b) => (b.timestamp as Timestamp).toMillis() - (a.timestamp as Timestamp).toMillis())
        .slice(0, 10);
  }, [events]);
  
  if (loading) {
      return <div>Cargando reportes...</div>
  }

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
              <XAxis dataKey="date" tickFormatter={(str) => format(new Date(str), 'dd MMM', { locale: es })}/>
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
                 labelFormatter={(label) => format(new Date(label), 'eeee, d MMM yyyy', { locale: es })}
              />
              <Legend />
              <Bar dataKey="clicks" fill="hsl(var(--primary))" name="Clics" />
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
                  <TableHead>Conversiones</TableHead>
                  <TableHead>Ganancias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignPerformance.map(campaign => (
                    <TableRow key={campaign.name}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.clicks}</TableCell>
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
                        <TableCell>{format((log.timestamp as Timestamp).toDate(), "d MMM yyyy, HH:mm:ss", { locale: es })}</TableCell>
                        <TableCell>{log.campaign || 'default'}</TableCell>
                        <TableCell>
                           <Badge variant="outline">Clic</Badge>
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

import React from 'react';

export default function AffiliateReportsPage() {
    return (
        <React.Suspense fallback={<div>Cargando reportes...</div>}>
            <AffiliateReportsContent />
        </React.Suspense>
    )
}
