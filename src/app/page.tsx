
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import ProductCard from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
  const directSaleProducts = products.filter(p => !p.isAuction);
  const auctionProducts = products.filter(p => p.isAuction);
  const bannerImages = [
    { id: 1, src: "https://picsum.photos/seed/b1/1600/400", alt: "Promoción de envío gratis", hint: "delivery promotion" },
    { id: 2, src: "https://picsum.photos/seed/b2/1600/400", alt: "Ofertas de tiempo limitado", hint: "limited time offer" },
    { id: 3, src: "https://picsum.photos/seed/b3/1600/400", alt: "Nuevos arribos en tecnología", hint: "tech sale" },
  ];

  return (
    <div className="flex flex-col min-h-dvh">
      
      <section className="w-full">
         <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {bannerImages.map((img) => (
                <CarouselItem key={img.id}>
                  <div className="relative aspect-[4/1] w-full">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      data-ai-hint={img.hint}
                      priority={img.id === 1}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex left-4" />
            <CarouselNext className="hidden lg:flex right-4" />
          </Carousel>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Pagá online</h3>
                <p className="text-xs text-muted-foreground">Con tarjeta o transferencia</p>
              </div>
            </div>
             <div className="flex items-center justify-center gap-3">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Envíos a todo el país</h3>
                <p className="text-xs text-muted-foreground">Recibí en la puerta de tu casa</p>
              </div>
            </div>
             <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Compra segura</h3>
                <p className="text-xs text-muted-foreground">Tu dinero está protegido</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured-products" className="py-16 md:py-24 bg-background w-full">
        <div className="container mx-auto px-4 md:px-6 space-y-16">
          
          <div>
            <div className="flex justify-between items-center mb-8">
              <Link href="/products" className="group">
                <h2 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  Venta Directa
                </h2>
                 <p className="text-muted-foreground group-hover:text-primary transition-colors">Cómpralo ahora.</p>
              </Link>
            </div>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {directSaleProducts.map((product) => (
                  <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex" />
              <CarouselNext className="hidden lg:flex" />
            </Carousel>
          </div>

          <div>
             <div className="flex justify-between items-center mb-8">
              <Link href="/products" className="group">
                <h2 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  Subastas Activas
                </h2>
                 <p className="text-muted-foreground group-hover:text-primary transition-colors">Haz tu mejor oferta.</p>
              </Link>
            </div>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {auctionProducts.map((product) => (
                  <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                     <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex" />
              <CarouselNext className="hidden lg:flex" />
            </Carousel>
          </div>

        </div>
      </section>
    </div>
  );
}
