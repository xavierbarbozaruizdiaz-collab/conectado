
'use client';

import { useState, useMemo } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCollection, useFirestore, collection } from '@/firebase';
import type { Banner } from '@/lib/types';
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Badge } from '@/components/ui/badge';

function AddBannerDialog({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [alt, setAlt] = useState('');
    const [src, setSrc] = useState('https://picsum.photos/seed/newbanner/1600/400');
    const [link, setLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!firestore) return;
        setIsSaving(true);
        const bannerData = {
            alt,
            src,
            link,
            status: 'Activo' as const
        };
        try {
            await addDoc(collection(firestore, 'banners'), bannerData);
            toast({ title: 'Banner añadido' });
            setOpen(false);
            setAlt(''); setSrc('https://picsum.photos/seed/newbanner/1600/400'); setLink('');
        } catch (e) {
            const permissionError = new FirestorePermissionError({
                path: 'banners',
                operation: 'create',
                requestResourceData: bannerData
            });
            errorEmitter.emit('permission-error', permissionError);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Añadir Nuevo Banner</DialogTitle>
                    <DialogDescription>Completa la información para el nuevo banner.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="alt">Texto Alternativo</Label>
                        <Input id="alt" value={alt} onChange={e => setAlt(e.target.value)} placeholder="Promoción de verano" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="src">URL de la Imagen</Label>
                        <Input id="src" value={src} onChange={e => setSrc(e.target.value)} placeholder="https://picsum.photos/..." />
                         <p className="text-xs text-muted-foreground">Usa picsum.photos o una URL de Unsplash.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="link">Enlace de Destino</Label>
                        <Input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder="/products?promo=verano" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Banner'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminBannersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const bannersQuery = useMemo(() => {
    return firestore ? collection(firestore, 'banners') : null;
  }, [firestore]);
  const { data: banners, loading } = useCollection<Banner>(bannersQuery);

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, 'banners', id))
        .then(() => toast({ title: 'Banner eliminado' }))
        .catch(e => {
             const permissionError = new FirestorePermissionError({ path: `banners/${id}`, operation: 'delete' });
             errorEmitter.emit('permission-error', permissionError);
        });
  };

  const toggleStatus = (banner: Banner) => {
      if (!firestore || !banner.id) return;
      const newStatus = banner.status === 'Activo' ? 'Inactivo' : 'Activo';
      const docRef = doc(firestore, 'banners', banner.id);
      updateDoc(docRef, { status: newStatus })
        .then(() => toast({ title: 'Estado actualizado' }))
        .catch(e => {
            const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'update', requestResourceData: { status: newStatus }});
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  return (
    <div className="space-y-8">
      <AddBannerDialog open={isAddDialogOpen} setOpen={setIsAddDialogOpen} />
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Banners</h1>
          <p className="text-muted-foreground">
            Administra los banners promocionales de la página principal.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Nuevo Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banners Activos e Inactivos</CardTitle>
          <CardDescription>
            {banners?.length || 0} banners en total.
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
              {loading && <TableRow><TableCell colSpan={5} className="text-center">Cargando banners...</TableCell></TableRow>}
              {!loading && banners?.map((banner) => (
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
                  <TableCell>
                      <Badge variant={banner.status === 'Activo' ? 'default' : 'secondary'}>
                          {banner.status}
                      </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => toggleStatus(banner)}>
                          {banner.status === 'Activo' ? 'Desactivar' : 'Activar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(banner.id!)}>
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
