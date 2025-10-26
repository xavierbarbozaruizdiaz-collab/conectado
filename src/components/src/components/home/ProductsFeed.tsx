'use client';

import React from 'react';
import Link from 'next/link';
// OJO: si tu alias no es "@/firebase", cambia el import a la ruta correcta.
import { useCollection, collection, query, where, orderBy } from '@/firebase';

export default function ProductsFeed() {
  const { data, loading, error } = useCollection(
    query(
      collection('products'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    )
  );

  if (loading) return <div className="text-muted-foreground">Cargando productos…</div>;
  if (error) return <div className="text-destructive">Error: {String(error)}</div>;
  if (!data?.length) return <div>No hay productos disponibles.</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((doc) => {
        const p = doc.data() as any;
        return (
          <article key={doc.id} className="rounded-xl border p-3">
            <img
              src={p.images?.[0]}
              alt={p.title}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="font-medium line-clamp-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground">${p.price}</p>
            {p.vendorSlug && (
              <Link
                href={`/tienda/${p.vendorSlug}`}
                className="text-sm text-primary hover:underline"
              >
                Ver tienda
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
