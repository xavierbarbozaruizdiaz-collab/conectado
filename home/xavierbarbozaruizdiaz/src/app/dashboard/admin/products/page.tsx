
"use client"
import { useState, useMemo } from 'react';
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
import { Input } from "@/components/ui/input";
import { useCollection, collection, useFirestore, query, where, deleteDoc, doc } from '@/firebase';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { MoreHorizontal, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();
  const { toast } = useToast();

  const productsQuery = useMemo(() => {
    // Solo busca cuando el usuario ha escrito algo
    if (!firestore || !searchTerm) return null;
    // Esta es una búsqueda simple por nombre. Para búsquedas más complejas, se necesitarían índices compuestos.
    return query(collection(firestore, 'products'));
  }, [firestore, searchTerm]);

  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => 
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sellerId || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  
  const handleDeleteProduct = (productId: string) => {
    if (!firestore || !confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) return;

    const docRef = doc(firestore, 'products', productId);
    deleteDoc(docRef)
        .then(() => {
            toast({
                title: 'Producto eliminado',
                description: 'El producto ha sido eliminado de la plataforma.',
            });
        })
        .catch((e) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
             toast({
                variant: 'destructive',
                title: 'Error al eliminar',
                description: 'No se pudo eliminar el producto.',
            });
        });
  };

  const loading = productsLoading;

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold">Gestión de Productos</h1>
            <p className="text-muted-foreground">
            Busca y gestiona todos los productos de la plataforma.
            </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Todos los Productos</CardTitle>
                    <CardDescription>
                        {searchTerm ? `${filteredProducts.length} productos encontrados.` : 'Introduce un término para buscar productos.'}
                    </CardDescription>
                </div>
                 <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, ID o vendedor..."
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
                <TableHead>Producto</TableHead>
                <TableHead>ID Vendedor</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && searchTerm && <TableRow><TableCell colSpan={5} className="text-center">Buscando...</TableCell></TableRow>}
              {!loading && filteredProducts.map((product) => {
                return (
                    <TableRow key={product.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border">
                                <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                            </div>
                            <span className="font-medium">{product.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                        {product.sellerId}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
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
                            <DropdownMenuItem asChild>
                                <Link href={`/products/${product.id}`}>Ver Producto</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/seller/products/${product.id}/edit`}>Editar</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(product.id!)}>
                              Eliminar Producto
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                );
              })}
              {!searchTerm && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Empieza a buscar para ver los productos.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
