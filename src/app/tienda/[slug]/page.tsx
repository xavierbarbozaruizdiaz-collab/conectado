'use client';

import { useCollection, collection, query, where } from '@/firebase';
import { useParams } from 'next/navigation';

export default function TiendaPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: vendor } = useCollection(
    query(collection('vendors'), where('slug', '==', slug))
  );

  const sellerId = vendor?.[0]?.id;
  const { data: prods } = useCollection(
    sellerId
      ? query(collection('products'), where('sellerId', '==', sellerId))
      : null
  );

  if (!vendor) return <div className="p-6">Cargando…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{vendor?.[0]?.displayName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {prods?.map((p: any) => (
          <div key={p.id} className="rounded-xl border p-4 bg-card">
            <img
              src={p.images?.[0]}
              alt={p.title}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-muted-foreground">${p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}  
