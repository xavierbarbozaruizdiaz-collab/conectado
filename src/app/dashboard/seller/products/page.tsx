
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MoreHorizontal, Plus, Search, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Product, SubscriptionTier, UserProfile } from '@/lib/types';
import { useFirestore, useUser, useCollection, query, where, collection, doc } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function SellerProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();
  const firestore = useFirestore();

  const productsQuery = useMemo(() => user ? query(collection(firestore!, 'products'), where('sellerId', '==', user.uid)) : null, [user, firestore]);
  const { data: sellerProducts, loading: productsLoading } = useCollection<Product>(productsQuery);

  const userDocRef = useMemo(() => user ? doc(firestore!, 'users', user.uid) : null, [user, firestore]);
  const { data: userData } = useDoc<UserProfile>(userDocRef);

  const tiersQuery = useMemo(() => firestore ? collection(firestore!, 'subscriptionTiers') : null, [firestore]);
  const { data: tiers, loading: tiersLoading } = useCollection<SubscriptionTier>(tiersQuery);
  
  const currentTier = useMemo(() => {
      if (!tiers || !userData) return null;
      // Default to "Gratis" if not set
      const tierName = userData.subscriptionTier || 'Gratis'; 
      return tiers.find(t => t.name === tierName) || tiers.find(t => t.name === 'Gratis');
  }, [tiers, userData]);


  const filteredProducts = useMemo(() => {
    if (!sellerProducts) return [];
    return sellerProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellerProducts, searchTerm]);

  const loading = productsLoading || tiersLoading;
  
  const productCount = sellerProducts?.length || 0;
  const productLimit = currentTier?.maxProducts ?? 5;
  const canAddProduct = productCount < productLimit;
  const progress = productLimit === Infinity ? 0 : (productCount / productLimit) * 100;

  if (loading) {
    return <div>Cargando tus productos...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Mis Productos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los productos de tu tienda.
          </p>
        </div>
        <Button asChild disabled={!canAddProduct}>
          <Link href="/dashboard/seller/add-product">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Producto
          </Link>
        </Button>
      </div>
      
      {currentTier && (
          <Alert>
             <Star className="h-4 w-4" />
            <AlertTitle>Plan {currentTier.name}</AlertTitle>
            <AlertDescription>
              Has publicado {productCount} de {productLimit === Infinity ? 'ilimitados' : productLimit} productos.
              {productLimit !== Infinity && 
                <Progress value={progress} className="mt-2" />
              }
               {!canAddProduct && (
                 <p className="mt-2 text-sm text-destructive">
                   Has alcanzado tu límite de productos. <Link href="/pricing" className="font-bold underline">Mejora tu plan</Link> para publicar más.
                 </p>
               )}
            </AlertDescription>
          </Alert>
      )}


      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Todos tus Productos</CardTitle>
              <CardDescription>
                {filteredProducts.length} productos encontrados.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en tus productos..."
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
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
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
                  <TableCell>{product.isAuction ? 'Subasta' : 'Venta Directa'}</TableCell>
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
                        <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
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
