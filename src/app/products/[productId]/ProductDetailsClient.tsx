"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuctionTimer from "@/components/auction-timer";
import { Hammer, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <div className="space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint="product image"
            />
            {product.isAuction && (
                <Badge variant="destructive" className="absolute top-4 right-4 text-sm px-3 py-1 bg-accent text-accent-foreground">
                    <Hammer className="w-4 h-4 mr-2"/>
                    Subasta
                </Badge>
            )}
        </div>
        <div className="space-y-3">
             <Badge variant="secondary">{product.category}</Badge>
        </div>

        {product.isAuction && product.auctionEndDate ? (
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Subasta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AuctionTimer endDate={product.auctionEndDate} />
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground">Puja Actual</div>
                        <div className="text-4xl font-bold text-primary">{formatCurrency(product.price)}</div>
                    </div>
                    <form className="flex gap-2">
                        <Input type="number" placeholder="Monto de tu puja" className="flex-grow" />
                        <Button type="submit" className="bg-accent hover:bg-accent/90">Pujar</Button>
                    </form>
                </CardContent>
            </Card>
        ) : (
            <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-primary">{formatCurrency(product.price)}</span>
                <Button onClick={handleAddToCart} size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Añadir al Carrito
                </Button>
            </div>
        )}
    </div>
  );
}
