
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, collection, query, orderBy } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { Product, UserProfile, Category, Location } from '@/lib/types';
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

export default function StoresPage() {
  const firestore = useFirestore();

  const usersQuery = useMemo(() => (firestore ? collection(firestore, 'users') : null), [firestore]);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const productsQuery = useMemo(() => (firestore ? collection(firestore, 'products') : null), [firestore]);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  const categoriesQuery = useMemo(() => (firestore ? query(collection(firestore, 'categories'), orderBy('name')) : null), [firestore]);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(categoriesQuery);

  const locationsQuery = useMemo(() => (firestore ? query(collection(firestore, 'locations'), orderBy('name')) : null), [firestore]);
  const { data: locations, loading: locationsLoading } = useCollection<Location>(locationsQuery);

  const { departments, subLocations } = useMemo(() => {
    if (!locations) return { departments: [], subLocations: [] };
    return {
        departments: locations.filter(l => l.level === 0),
        subLocations: locations.filter(l => l.level === 1),
    };
  }, [locations]);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [subLocationFilter, setSubLocationFilter] = useState<string>('all');
  
  const filteredSubLocations = useMemo(() => {
      if (departmentFilter === 'all') return [];
      const departmentId = departments.find(d => d.name === departmentFilter)?.id;
      return subLocations.filter(s => s.parentId === departmentId);
  }, [departmentFilter, departments, subLocations]);

  useEffect(() => {
    setSubLocationFilter('all');
  }, [departmentFilter]);


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
      const subLocationMatch = subLocationFilter === 'all' || user.city === subLocationFilter;
      return categoryMatch && departmentMatch && subLocationMatch;
    });
  }, [users, categoryFilter, departmentFilter, subLocationFilter, storeCategories]);

  const loading = usersLoading || productsLoading || categoriesLoading || locationsLoading;

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
            {categories?.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {departments?.map(dep => <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select onValueChange={setSubLocationFilter} value={subLocationFilter} disabled={departmentFilter === 'all'}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por zona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las zonas</SelectItem>
            {filteredSubLocations.map(sub => <SelectItem key={sub.id} value={sub.name}>{sub.name}</SelectItem>)}
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

