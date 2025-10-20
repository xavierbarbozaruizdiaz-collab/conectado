"use client";

import { useState } from "react";
import { products, categories } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductType = "all" | "direct" | "auction";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [productType, setProductType] = useState<ProductType>("all");

  const filteredProducts = products
    .filter((product) => {
      const categoryMatch =
        activeCategory === "All" || product.category === activeCategory;
      const searchMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
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
          // This would need a date field in a real app
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Explora Nuestros Productos</h1>
        <p className="text-muted-foreground mt-2">Encuentra lo que buscas en nuestra amplia colección.</p>
      </div>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Categorías</h3>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      activeCategory === "All" && "bg-muted font-bold"
                    )}
                    onClick={() => setActiveCategory("All")}
                  >
                    Todas las Categorías
                  </Button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        activeCategory === category.name && "bg-muted font-bold"
                      )}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
             <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setSortBy} defaultValue="featured">
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

           <div className="mb-8">
            <Tabs 
              defaultValue="all" 
              className="w-full" 
              onValueChange={(value) => setProductType(value as ProductType)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="direct">Venta Directa</TabsTrigger>
                <TabsTrigger value="auction">En Subasta</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                <p className="text-muted-foreground">No se encontraron productos. Intenta ajustar tus filtros.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
