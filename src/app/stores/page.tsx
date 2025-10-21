
'use client';

import { useCollection, collection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { User } from '@/lib/data';
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function StoresPage() {
  const firestore = useFirestore();
  const { data: users, loading } = useCollection<User>(
    firestore ? collection(firestore, 'users') : null
  );

  if (loading) {
      return <div>Cargando tiendas...</div>
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Todas las Tiendas</h1>
        <p className="text-muted-foreground mt-2">
          Descubre a los vendedores que hacen posible nuestro mercado.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        {(users || []).map((user) => (
          <Link href={`/store/${user.id}`} key={user.id} className="group">
            <Card className="overflow-hidden text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-4 flex flex-col items-center gap-3">
                <Avatar className="h-24 w-24 border-2 border-transparent group-hover:border-primary transition-all duration-300">
                  <AvatarImage src={user.profilePictureUrl} alt={user.storeName} />
                  <AvatarFallback>{user.storeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate w-full">
                  {user.storeName}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
