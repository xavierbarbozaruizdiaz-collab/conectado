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
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
                 <ProductDetailsClient product={product} />
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="space-y-3">
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">{product.name}</h1>
                    <p className="text-muted-foreground text-lg">{product.description}</p>
                </div>
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
