"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import { Search } from "lucide-react";
import type { Product } from "@/lib/data";

interface StoreProductsProps {
  products: Product[];
  storeName: string;
}

export default function StoreProducts({ products, storeName }: StoreProductsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  return (
    <>
      <div className="flex justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold">Products from {storeName}</h2>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in this store..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            {searchTerm ? "No products match your search." : "This store has no products yet."}
          </p>
        </div>
      )}
    </>
  );
}
