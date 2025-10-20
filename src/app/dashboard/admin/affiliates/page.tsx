
'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { affiliates, Affiliate } from '@/lib/data';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pagado':
      return <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Pagado</Badge>;
    case 'Pendiente':
      return <Badge variant="outline">Pendiente</Badge>;
    case 'Procesando':
        return <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">Procesando</Badge>;
    case 'Rechazado':
      return <Badge variant="destructive">Rechazado</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};


export default function AdminAffiliatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentAffiliates, setCurrentAffiliates] = useState<Affiliate[]>(affiliates);

  const filteredAffiliates = currentAffiliates.filter(
    (affiliate) =>
      affiliate.user.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleMarkAsPaid = (paymentId: string) => {
      // In a real app, this would be an API call.
      // Here we just update the local state.
      setCurrentAffiliates(prev => prev.map(aff => ({
          ...aff,
          paymentHistory: aff.paymentHistory.map(p => p.id === paymentId ? {...p, status: 'Pagado'} : p)
      })))
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Afiliados</h1>
        <p className="text-muted-foreground">
          Supervisa a tus afiliados, sus ganancias y gestiona los pagos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Afiliados</CardTitle>
              <CardDescription>
                {currentAffiliates.length} afiliados en total.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por tienda o código..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Afiliado</TableHead>
                <TableHead>Código de Afiliado</TableHead>
                <TableHead>Ganancias Totales</TableHead>
                <TableHead>Saldo Pendiente</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={affiliate.user.profilePictureUrl} />
                        <AvatarFallback>{affiliate.user.storeName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{affiliate.user.storeName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{affiliate.affiliateCode}</TableCell>
                  <TableCell>{formatCurrency(affiliate.totalEarnings)}</TableCell>
                  <TableCell className="font-semibold text-primary">{formatCurrency(affiliate.pendingBalance)}</TableCell>
                  <TableCell className="text-right">
                     <Button variant="outline" size="sm">Asignar Afiliado</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Pago de Afiliados</CardTitle>
          <CardDescription>Revisa y aprueba los pagos pendientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                 <TableHead>Fecha</TableHead>
                <TableHead>Afiliado</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAffiliates.flatMap(aff => aff.paymentHistory.map(p => ({...p, user: aff.user}))).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(payment => (
                  <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.user.storeName}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={payment.status !== 'Pendiente'}>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones de Pago</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleMarkAsPaid(payment.id)}>
                                    Marcar como Pagado
                                </DropdownMenuItem>
                                <DropdownMenuItem>Ver detalles del Afiliado</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Rechazar Pago</DropdownMenuItem>
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
