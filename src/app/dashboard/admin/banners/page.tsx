
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
import { MoreHorizontal, Plus } from 'lucide-react';
import Image from 'next/image';

// Datos de ejemplo para los banners. En una aplicación real, vendrían de una API.
const bannerImages = [
  {
    id: 1,
    src: 'https://picsum.photos/seed/b1/1600/400',
    alt: 'Promoción de envío gratis',
    status: 'Activo',
    link: '/products?promo=free-shipping',
  },
  {
    id: 2,
    src: 'https://picsum.photos/seed/b2/1600/400',
    alt: 'Ofertas de tiempo limitado',
    status: 'Activo',
    link: '/products?type=auction',
  },
  {
    id: 3,
    src: 'https://picsum.photos/seed/b3/1600/400',
    alt: 'Nuevos arribos en tecnología',
    status: 'Inactivo',
    link: '/products?category=Electrónica',
  },
];

export default function AdminBannersPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Banners</h1>
          <p className="text-muted-foreground">
            Administra los banners promocionales de la página principal.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Nuevo Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banners Activos e Inactivos</CardTitle>
          <CardDescription>
            {bannerImages.length} banners en total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Previsualización</TableHead>
                <TableHead>Texto Alternativo</TableHead>
                <TableHead>Enlace de Destino</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bannerImages.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="relative h-10 w-40 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={banner.src}
                        alt={banner.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{banner.alt}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {banner.link}
                  </TableCell>
                  <TableCell>{banner.status}</TableCell>
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>
                          {banner.status === 'Activo' ? 'Desactivar' : 'Activar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar
                        </DropdownMenuItem>
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
