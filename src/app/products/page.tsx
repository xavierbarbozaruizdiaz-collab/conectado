"use client";

import { useState } from "react";
import { products, categories } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      
      <main>
        <div className="mb-8 p-4 bg-card border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar productos..."
                        className="pl-9 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto justify-between">
                        <span>{activeCategory === "All" ? "Todas las Categorías" : activeCategory}</span>
                        <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full md:w-[250px]">
                        <DropdownMenuItem onClick={() => setActiveCategory("All")}>
                            Todas las Categorías
                        </DropdownMenuItem>
                        {categories.map((category) => (
                            <DropdownMenuItem key={category.id} onClick={() => setActiveCategory(category.name)}>
                                <category.icon className="h-4 w-4 mr-2" />
                                {category.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Select onValueChange={setSortBy} defaultValue="featured">
                    <SelectTrigger className="w-full md:w-auto">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
}
