import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
              Mercadito Online
            </h1>
            <p className="max-w-[600px] mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground">
              Discover unique items, sell your goods, and join a vibrant community. Your next treasure is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="#featured-products">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard/seller">
                  Become a Seller
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
            Shop by Category
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
            Featured Products
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
              <h3 className="text-xl font-bold">Direct & Auction Sales</h3>
              <p className="text-muted-foreground">
                Choose your selling style. Offer items at a fixed price or let the highest bidder win with our exciting auction format.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Instant Communication</h3>
              <p className="text-muted-foreground">
                Connect with sellers instantly using the integrated WhatsApp button. Ask questions and close deals faster than ever.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure & Trusted</h3>
              <p className="text-muted-foreground">
                Benefit from user profiles and storefronts to build trust. Find reliable sellers and build your own reputation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
