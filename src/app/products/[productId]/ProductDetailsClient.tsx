
"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hammer, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import CircularAuctionTimer from "@/components/circular-auction-timer";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Store, MessageSquare } from "lucide-react";
import { users } from "@/lib/data";
import { useState } from "react";

function ProductImageGallery({ images, productName }: { images: string[], productName: string }) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg">
                <Image
                    src={images[selectedImage]}
                    alt={`${productName} - image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    data-ai-hint="product image"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative aspect-square w-full overflow-hidden rounded-md border-2 transition-all",
                            selectedImage === index ? "border-primary" : "border-transparent hover:border-primary/50"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}


export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const seller = users.find((u) => u.id === product.sellerId);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <>
      <div className="col-span-1">
        <ProductImageGallery images={product.imageUrls} productName={product.name} />
        {product.isAuction && (
          <Badge variant="destructive" className="absolute top-4 right-4 text-sm px-3 py-1 bg-accent text-accent-foreground">
            <Hammer className="w-4 h-4 mr-2" />
            Subasta
          </Badge>
        )}
      </div>
      
      <div className="col-span-1 flex flex-col gap-8">
        <div className="space-y-4">
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground text-lg">{product.description}</p>
        </div>

        {product.isAuction && product.auctionEndDate ? (
          <Card>
            <CardHeader className="items-center">
              <CardTitle>Detalles de la Subasta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CircularAuctionTimer endDate={product.auctionEndDate} />
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
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold text-primary">{formatCurrency(product.price)}</span>
            </div>
            <Button onClick={handleAddToCart} size="lg" className="w-full">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Añadir al Carrito
            </Button>
          </div>
        )}
         {seller && (
            <Card>
                <CardHeader>
                    <CardTitle>Información del Vendedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={seller.profilePictureUrl} alt={seller.storeName} />
                            <AvatarFallback>{seller.storeName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-lg">{seller.storeName}</h3>
                            <p className="text-sm text-muted-foreground">{seller.storeDescription}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button asChild className="flex-1" variant="outline">
                            <Link href={`/store/${seller.id}`}>
                                <Store className="mr-2 h-4 w-4" /> Visitar Tienda
                            </Link>
                        </Button>
                        <Button asChild className="flex-1">
                            <a href={`https://wa.me/${seller.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="mr-2 h-4 w-4" /> Contactar
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </>
  );
}
