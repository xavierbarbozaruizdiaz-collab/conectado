
'use client';

import { useState, useMemo } from 'react';
import { useCollection, collection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { User, Product } from '@/lib/data';
import type { UserProfile } from '@/lib/types';
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from '@/lib/data';

const departments = [
    "Asunción", "Concepción", "San Pedro", "Cordillera", "Guairá", "Caaguazú", 
    "Caazapá", "Itapúa", "Misiones", "Paraguarí", "Alto Paraná", "Central", 
    "Ñeembucú", "Amambay", "Canindeyú", "Presidente Hayes", "Boquerón", "Alto Paraguay"
];

export default function StoresPage() {
  const firestore = useFirestore();

  const usersQuery = useMemo(() => (firestore ? collection(firestore, 'users') : null), [firestore]);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const productsQuery = useMemo(() => (firestore ? collection(firestore, 'products') : null), [firestore]);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const storeCategories = useMemo(() => {
    if (!products) return {};
    const categoriesByStore: { [storeId: string]: Set<string> } = {};
    products.forEach(product => {
      if (!categoriesByStore[product.sellerId]) {
        categoriesByStore[product.sellerId] = new Set();
      }
      categoriesByStore[product.sellerId].add(product.category);
    });
    return categoriesByStore;
  }, [products]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => {
      const categoryMatch = categoryFilter === 'all' || (storeCategories[user.uid] && storeCategories[user.uid].has(categoryFilter));
      const departmentMatch = departmentFilter === 'all' || user.department === departmentFilter;
      return categoryMatch && departmentMatch;
    });
  }, [users, categoryFilter, departmentFilter, storeCategories]);

  const loading = usersLoading || productsLoading;

  if (loading) {
      return <div>Cargando tiendas...</div>
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Todas las Tiendas</h1>
        <p className="text-muted-foreground mt-2">
          Descubre a los vendedores que hacen posible nuestro mercado.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Select onValueChange={setCategoryFilter} value={categoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        {(filteredUsers || []).map((user) => (
          <Link href={`/store/${user.uid}`} key={user.uid} className="group">
            <Card className="overflow-hidden text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-4 flex flex-col items-center gap-3">
                <Avatar className="h-24 w-24 border-2 border-transparent group-hover:border-primary transition-all duration-300">
                  <AvatarImage src={user.profilePictureUrl} alt={user.storeName || ''} />
                  <AvatarFallback>{user.storeName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate w-full">
                  {user.storeName}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {filteredUsers.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full mt-8">
              <p className="text-muted-foreground">No se encontraron tiendas que coincidan con tus filtros.</p>
          </div>
      )}
    </div>
  );
}
