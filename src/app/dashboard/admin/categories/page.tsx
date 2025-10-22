
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
import { useCollection, useFirestore, collection } from '@/firebase';
import type { Category } from '@/lib/types';
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import * as LucideIcons from 'lucide-react';

function ManageCategoryDialog({ open, setOpen, category }: { open: boolean, setOpen: (open: boolean) => void, category: Category | null }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const isEditing = useMemo(() => category !== null, [category]);

    useState(() => {
        if (category) {
            setName(category.name);
            setIcon(category.icon);
        } else {
            setName('');
            setIcon('');
        }
    });

    const handleSave = async () => {
        if (!firestore) return;
        setIsSaving(true);
        const categoryData = { name, icon };
        
        try {
            if (isEditing && category?.id) {
                const docRef = doc(firestore, 'categories', category.id);
                await updateDoc(docRef, categoryData);
                toast({ title: 'Categoría actualizada' });
            } else {
                await addDoc(collection(firestore, 'categories'), categoryData);
                toast({ title: 'Categoría añadida' });
            }
            setOpen(false);
        } catch (e) {
            const permissionError = new FirestorePermissionError({
                path: 'categories',
                operation: isEditing ? 'update' : 'create',
                requestResourceData: categoryData
            });
            errorEmitter.emit('permission-error', permissionError);
        } finally {
            setIsSaving(false);
        }
    };
    
    const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons.Package;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Categoría' : 'Añadir Nueva Categoría'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre de la Categoría</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Moda" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="icon">Nombre del Icono (lucide-react)</Label>
                        <div className="flex items-center gap-2">
                            <Input id="icon" value={icon} onChange={e => setIcon(e.target.value)} placeholder="Ej: Shirt" />
                            <IconComponent className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">Busca nombres de iconos en <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide.dev</a>.</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const categoriesQuery = useMemo(() => {
    return firestore ? collection(firestore, 'categories') : null;
  }, [firestore]);
  const { data: categories, loading } = useCollection<Category>(categoriesQuery);
  
  const openDialog = (category: Category | null = null) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  }

  const handleDelete = (id: string) => {
    if (!firestore || !confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;
    deleteDoc(doc(firestore, 'categories', id))
        .then(() => toast({ title: 'Categoría eliminada' }))
        .catch(e => {
             const permissionError = new FirestorePermissionError({ path: `categories/${id}`, operation: 'delete' });
             errorEmitter.emit('permission-error', permissionError);
        });
  };

  return (
    <div className="space-y-8">
      <ManageCategoryDialog open={isDialogOpen} setOpen={setIsDialogOpen} category={selectedCategory} />
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
          <p className="text-muted-foreground">
            Administra las categorías de productos de la plataforma.
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Categoría
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categorías de Productos</CardTitle>
          <CardDescription>
            {categories?.length || 0} categorías en total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icono</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Nombre del Icono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={4} className="text-center">Cargando categorías...</TableCell></TableRow>}
              {!loading && categories?.map((category) => {
                  const Icon = LucideIcons[category.icon as keyof typeof LucideIcons] || LucideIcons.Package;
                  return (
                    <TableRow key={category.id}>
                        <TableCell>
                            <Icon className="h-5 w-5" />
                        </TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="font-mono text-xs">{category.icon}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" onClick={() => openDialog(category)}>Editar</Button>
                           <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(category.id!)}>Eliminar</Button>
                        </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    