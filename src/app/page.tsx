
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, collection } from '@/firebase/firestore/use-collection';
import type { Product } from '@/lib/data';
import type { Banner, UserProfile } from '@/lib/types';
import ProductCard from '@/components/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CreditCard, ShieldCheck, Truck, Store } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay"
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirestore } from '@/firebase';

export default function Home() {
  const firestore = useFirestore();

  const productsQuery = useMemo(() => {
    return firestore ? collection(firestore, 'products') : null;
  }, [firestore]);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  const usersQuery = useMemo(() => {
    return firestore ? collection(firestore, 'users') : null;
  }, [firestore]);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const bannersQuery = useMemo(() => {
    return firestore ? collection(firestore, 'banners') : null;
  }, [firestore]);
  const { data: banners, loading: bannersLoading } = useCollection<Banner>(bannersQuery);

  const directSaleProducts = useMemo(() => {
    return (products || []).filter((p) => !p.isAuction);
  }, [products]);
  
  const auctionProducts = useMemo(() => {
    return (products || []).filter((p) => p.isAuction);
  }, [products]);

  const activeBanners = useMemo(() => {
    return (banners || []).filter(b => b.status === 'Activo');
  }, [banners]);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <div className="flex flex-col min-h-dvh">
      <section className="w-full">
        <Carousel 
            plugins={[autoplayPlugin.current]}
            opts={{ loop: (activeBanners.length || 0) > 1 }} 
            className="w-full"
            onMouseEnter={autoplayPlugin.current.stop}
            onMouseLeave={autoplayPlugin.current.reset}
        >
          <CarouselContent>
            {(bannersLoading || activeBanners.length === 0) ? (
              <CarouselItem>
                <div className="relative aspect-[4/1] w-full bg-muted animate-pulse" />
              </CarouselItem>
            ) : (
              activeBanners.map((banner, index) => (
                <CarouselItem key={banner.id}>
                  <Link href={banner.link || '#'}>
                    <div className="relative aspect-[4/1] w-full">
                      <Image
                        src={banner.src}
                        alt={banner.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))
            )}
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
                <p className="text-xs text-muted-foreground">
                  Con tarjeta o transferencia
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Envíos a todo el país</h3>
                <p className="text-xs text-muted-foreground">
                  Recibí en la puerta de tu casa
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Compra segura</h3>
                <p className="text-xs text-muted-foreground">
                  Tu dinero está protegido
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stores" className="py-12 md:py-16 bg-background w-full">
        <div className="container mx-auto px-4 md:px-6">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Explora Nuestras Tiendas</h2>
               <Button asChild variant="outline">
                  <Link href="/stores">
                      Ver Todas las Tiendas <Store className="ml-2 h-4 w-4" />
                  </Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {(users || []).slice(0, 6).map(user => (
                  <Link href={`/store/${user.uid}`} key={user.uid} className="group flex flex-col items-center gap-2 text-center">
                    <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-transparent group-hover:border-primary transition-all duration-300">
                        <AvatarImage src={user.profilePictureUrl} />
                        <AvatarFallback>{user.storeName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{user.storeName}</p>
                  </Link>  
                ))}
            </div>
        </div>
      </section>

      <section
        id="featured-products"
        className="py-12 md:py-16 bg-card w-full"
      >
        <div className="container mx-auto px-4 md:px-6 space-y-12">
          <div>
            <div className="flex justify-between items-center mb-8">
              <Link href="/products?type=direct" className="group">
                <h2 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  Venta Directa
                </h2>
                <p className="text-muted-foreground group-hover:text-primary transition-colors">
                  Cómpralo ahora.
                </p>
              </Link>
            </div>
            <Carousel
              opts={{ align: 'start', loop: directSaleProducts.length > 4 }}
              className="w-full"
            >
              <CarouselContent>
                {directSaleProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
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
              <Link href="/products?type=auction" className="group">
                <h2 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  Subastas Activas
                </h2>
                <p className="text-muted-foreground group-hover:text-primary transition-colors">
                  Haz tu mejor oferta.
                </p>
              </Link>
            </div>
            <Carousel
              opts={{ align: 'start', loop: auctionProducts.length > 4 }}
              className="w-full"
            >
              <CarouselContent>
                {auctionProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
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
