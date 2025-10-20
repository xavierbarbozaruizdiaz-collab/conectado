
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { products, categories } from "@/lib/data";
import { ArrowRight, Tag, Zap, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const directSaleProducts = products.filter(p => !p.isAuction);
  const auctionProducts = products.filter(p => p.isAuction);

  return (
    <div className="flex flex-col min-h-dvh">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-primary">
              Mercadito Online
            </h1>
            <p className="max-w-[600px] mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground">
              Descubre artículos únicos, vende tus productos y únete a una comunidad vibrante. Tu próximo tesoro está a solo un clic de distancia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="#featured-products">
                  Empezar a Explorar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard/seller">
                  Conviértete en Vendedor
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-auto">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover rounded-xl shadow-2xl"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </div>
      </section>

      <section id="categories" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
            Compra por Categoría
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-lg">
            Explora nuestra amplia gama de productos seleccionando una categoría del menú desplegable a continuación.
          </p>
          <Select>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        <span>{category.name}</span>
                    </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section id="featured-products" className="py-16 md:py-24 bg-card w-full">
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Tag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Ventas Directas y Subastas</h3>
              <p className="text-muted-foreground">
                Elige tu estilo de venta. Ofrece artículos a un precio fijo o deja que el mejor postor gane con nuestro emocionante formato de subasta.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Comunicación Instantánea</h3>
              <p className="text-muted-foreground">
                Conéctate con los vendedores al instante usando el botón de WhatsApp integrado. Haz preguntas y cierra tratos más rápido que nunca.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Seguro y Confiable</h3>
              <p className="text-muted-foreground">
                Benefíciate de los perfiles de usuario y las tiendas para generar confianza. Encuentra vendedores confiables y construye tu propia reputación.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
