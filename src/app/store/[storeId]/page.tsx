"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { users, products as allProducts } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import { MessageSquare, Search } from "lucide-react";
import { useState, useMemo } from "react";

export default function StorePage({ params }: { params: { storeId: string } }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const seller = users.find((u) => u.id === params.storeId);

  const storeProducts = useMemo(() => {
    if (!seller) return [];
    const filtered = allProducts.filter((p) => p.sellerId === seller.id);
    if (!searchTerm) return filtered;
    return filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [seller, searchTerm]);

  if (!seller) {
    notFound();
  }

  return (
    <div>
      <section className="relative h-48 md:h-64 w-full">
        <Image
          src={seller.bannerUrl}
          alt={`${seller.storeName} banner`}
          fill
          className="object-cover"
          data-ai-hint="store banner"
        />
        <div className="absolute inset-0 bg-black/50" />
      </section>

      <div className="container mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
        <div className="bg-card p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
            <AvatarImage src={seller.profilePictureUrl} alt={seller.storeName} />
            <AvatarFallback>{seller.storeName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">{seller.storeName}</h1>
            <p className="text-muted-foreground mt-2">{seller.storeDescription}</p>
          </div>
          <Button asChild size="lg">
            <a href={`https://wa.me/${seller.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-2 h-5 w-5" /> Contact Seller
            </a>
          </Button>
        </div>
      </div>
      
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold">Products from {seller.storeName}</h2>
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

        {storeProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {storeProducts.map((product) => (
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
      </main>
    </div>
  );
}
