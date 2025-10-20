
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { products, categories } from "@/lib/data";
import ProductCard from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductType = "all" | "direct" | "auction";

const useProductFilters = () => {
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    
    const initialProductType = searchParams.get('type') as ProductType | null;
    const [productType, setProductType] = useState<ProductType>(initialProductType || "all");

    useEffect(() => {
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        if (category) setActiveCategory(category);
        if (search) setSearchTerm(search);
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                const categoryMatch = activeCategory === "All" || product.category === activeCategory;
                const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const typeMatch =
                    productType === 'all' ||
                    (productType === 'direct' && !product.isAuction) ||
                    (productType === 'auction' && product.isAuction);
                return categoryMatch && searchMatch && typeMatch;
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
    }, [activeCategory, searchTerm, productType, sortBy]);

    return { filteredProducts, productType, setProductType, sortBy, setSortBy };
};

function ProductsPageContent() {
  const { filteredProducts, productType, setProductType, sortBy, setSortBy } = useProductFilters();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Explora Nuestros Productos</h1>
        <p className="text-muted-foreground mt-2">Encuentra lo que buscas en nuestra amplia colección.</p>
      </div>
      
      <main>
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card border rounded-lg">
            <Tabs 
              value={productType}
              className="w-full sm:w-auto" 
              onValueChange={(value) => setProductType(value as ProductType)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="direct">Venta Directa</TabsTrigger>
                <TabsTrigger value="auction">En Subasta</TabsTrigger>
              </TabsList>
            </Tabs>

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
