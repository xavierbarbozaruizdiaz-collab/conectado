import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, users } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuctionTimer from "@/components/auction-timer";
import ProductCard from "@/components/product-card";
import { MessageSquare, ArrowRight, Store, Hammer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

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
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground text-lg">{product.description}</p>
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
            <div className="text-4xl font-bold text-primary">{formatCurrency(product.price)}</div>
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
                      <MessageSquare className="mr-2 h-4 w-4" /> Contactar por WhatsApp
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
