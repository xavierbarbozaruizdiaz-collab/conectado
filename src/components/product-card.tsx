
'use client';

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDoc, docRef, useFirestore } from "@/firebase";
import type { Product, User } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const firestore = useFirestore();
  const { data: seller, loading } = useDoc<User>(
    firestore && product.sellerId ? docRef(firestore, "users", product.sellerId) : null
  );

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="product image"
          />
          {product.isAuction && (
            <Badge variant="destructive" className="absolute top-3 right-3 bg-accent text-accent-foreground">
              Subasta
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg truncate">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">{product.description}</p>
        <div className="flex justify-between items-center pt-2">
          <p className="text-xl font-bold text-primary">{formatCurrency(product.price)}</p>
          {seller && (
            <Link href={`/store/${seller.id}`} className="flex items-center gap-2 group/seller">
              <span className="text-sm text-muted-foreground group-hover/seller:text-primary transition-colors">{seller.storeName}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={seller.profilePictureUrl} alt={seller.storeName} />
                <AvatarFallback>{seller.storeName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
