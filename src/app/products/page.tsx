
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { products } from "@/lib/data";
import ProductCard from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data";

type ProductType = "all" | "direct" | "auction";

const useProductFilters = () => {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    
    const productType = (searchParams.get('type') as ProductType | null) || "all";
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    useEffect(() => {
        setSearchTerm(search || "");
    }, [search]);

    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
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
                        return b.id.localeCompare(a.id);
                    default:
                        return 0;
                }
            });
    }, [searchTerm, productType, sortBy, category]);
    
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
        return "Encuentra lo que buscas en nuestra amplia colección.";
    }, [category, searchTerm, filteredProducts.length]);


    return { filteredProducts, sortBy, setSortBy, pageTitle, pageDescription };
};

function ProductsPageContent() {
  const { filteredProducts, sortBy, setSortBy, pageTitle, pageDescription } = useProductFilters();

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
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
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
