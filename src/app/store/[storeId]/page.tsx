import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { users, products as allProducts } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search } from "lucide-react";
import StoreProducts from "./StoreProducts";

export default function StorePage({ params }: { params: { storeId: string } }) {
  const seller = users.find((u) => u.id === params.storeId);

  if (!seller) {
    notFound();
  }

  const storeProducts = allProducts.filter((p) => p.sellerId === seller.id);

  return (
    <div>
      <section className="relative h-48 md:h-64 w-full">
        <Image
          src={seller.bannerUrl}
          alt={`Banner de ${seller.storeName}`}
          fill
          className="object-cover"
          data-ai-hint="store banner"
        />
        <div className="absolute inset-0 bg-black/50" />
      </section>

      <div className="container mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
        <div className="bg-card p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
            <AvatarImage src={seller.profilePictureUrl} alt={seller.storeName} />
            <AvatarFallback>{seller.storeName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">{seller.storeName}</h1>
            <p className="text-muted-foreground mt-2">{seller.storeDescription}</p>
          </div>
          <Button asChild size="lg">
            <a href={`https://wa.me/${seller.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-2 h-5 w-5" /> Contactar
            </a>
          </Button>
        </div>
      </div>
      
      <main className="container mx-auto px-4 md:px-6 py-12">
        <StoreProducts products={storeProducts} storeName={seller.storeName} />
      </main>
    </div>
  );
}
