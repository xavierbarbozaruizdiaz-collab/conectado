
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, users } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import { Store, MessageSquare } from "lucide-react";
import ProductDetailsClient from "./ProductDetailsClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";


export default function ProductPage({ params }: { params: { productId: string } }) {
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    notFound();
  }

  const seller = users.find((u) => u.id === product.sellerId);
  const relatedProducts = products.filter(p => p.sellerId === product.sellerId && p.id !== product.id).slice(0, 3);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <ProductDetailsClient product={product} />
        </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Más de {seller?.storeName}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
