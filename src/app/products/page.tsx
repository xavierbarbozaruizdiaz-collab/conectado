
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { useCollection, collection, query, orderBy, useFirestore } from '@/firebase';
import type { Product, Category } from '@/lib/types';
import ProductCard from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductType = "all" | "direct" | "auction";

const useProductFilters = () => {
    const searchParams = useSearchParams();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    
    const productType = (searchParams.get('type') as ProductType | null) || "all";
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Solo creamos la consulta si hay algún filtro activo, para evitar el `list` general.
    const productsQuery = useMemo(() => {
      if (!firestore) return null;
      // Si no hay filtros, no se carga nada inicialmente para evitar el error de permisos
      if (!category && !search && productType === 'all') return null;
      return query(collection(firestore, 'products'));
    }, [firestore, category, search, productType]);

    const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

    const categoriesQuery = useMemo(() => {
        return firestore ? query(collection(firestore, 'categories'), orderBy('name')) : null;
    }, [firestore]);
    const { data: categories, loading: categoriesLoading } = useCollection<Category>(categoriesQuery);


    useEffect(() => {
        setSearchTerm(search || "");
    }, [search]);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return (products || [])
            .filter((product) => {
                const searchMatch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const typeMatch =
                    productType === 'all' ||
                    (productType === 'direct' && !product.isAuction) ||
                    (productType === 'auction' && product.isAuction);
                const categoryMatch = !category || product.category === category;
                return searchMatch && typeMatch && categoryMatch;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-asc":
                        return a.price - b.price;
                    case "price-desc":
                        return b.price - a.price;
                    case "newest":
                        // Suponiendo que los IDs más nuevos son lexicográficamente mayores
                        return (b.id || "").localeCompare(a.id || "");
                    default:
                        return 0; 
                }
            });
    }, [searchTerm, productType, sortBy, category, products]);
    
    const pageTitle = useMemo(() => {
        if (category) {
            return `Explora ${category}`;
        }
        if (searchTerm) {
            return `Resultados para "${searchTerm}"`;
        }
        return "Explora Nuestros Productos";
    }, [category, searchTerm]);

    const pageDescription = useMemo(() => {
        if (category || searchTerm) {
            return `${filteredProducts.length} productos encontrados.`;
        }
        return "Filtra o busca para encontrar lo que necesitas.";
    }, [category, searchTerm, filteredProducts.length]);


    const loading = productsQuery === null ? false : productsLoading;

    return { filteredProducts, sortBy, setSortBy, pageTitle, pageDescription, loading, productsQuery };
};

function ProductsPageContent() {
  const { filteredProducts, sortBy, setSortBy, pageTitle, pageDescription, loading, productsQuery } = useProductFilters();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground mt-2">{pageDescription}</p>
        </div>
        <div className="w-full sm:w-auto">
          <Select onValueChange={setSortBy} defaultValue={sortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="newest">Más Nuevos</SelectItem>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
          </Select>
        </div>
      </div>
      
      <main>
        {loading && <div className="text-center py-16">Cargando productos...</div>}
        {!loading && productsQuery === null && (
             <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
              <p className="text-muted-foreground">Usa la barra de búsqueda o los filtros para empezar a explorar.</p>
          </div>
        )}
        {!loading && productsQuery !== null && filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : !loading && productsQuery !== null && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
              <p className="text-muted-foreground">No se encontraron productos. Intenta ajustar tus filtros.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// We wrap the page in a Suspense boundary to allow `useSearchParams` to work correctly.
export default function ProductsPage() {
    return (
        <React.Suspense fallback={<div>Cargando...</div>}>
            <ProductsPageContent />
        </React.Suspense>
    );
}
