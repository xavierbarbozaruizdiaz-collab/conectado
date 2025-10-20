import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { products, categories } from "@/lib/data";
import { ArrowRight, Tag, Zap, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/product-card";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-dvh">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-primary">
              Mercadito Xbar
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
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Compra por Categoría
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link href="#" key={category.id}>
                <Card className="group overflow-hidden text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                    <category.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-sm">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-products" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Productos Destacados
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
