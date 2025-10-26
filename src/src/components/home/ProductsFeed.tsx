'use client';

import { useCollection, collection, query, where, orderBy } from '@/firebase';
import { useMemo } from 'react';

export default function ProductsFeed() {
  const q = useMemo(() => {
    const col = collection('products');
    return query(col, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
  }, []);

  const { data, loading, error } = useCollection(q);

  if (loading) return <div className="p-6">Cargando productos…</div>;
  if (error)   return <div className="p-6 text-red-500">Error: {String(error)}</div>;
  if (!data?.length) return <div className="p-6">No hay productos aún.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {data.map((p: any) => (
        <div key={p.id} className="rounded-xl border p-4 bg-card">
          <img
            src={p.images?.[0]}
            alt={p.title}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <div className="font-medium">{p.title}</div>
          <div className="text-sm text-muted-foreground">
            ${p.price?.toFixed?.(2) ?? p.price}
          </div>
        </div>
      ))}
    </div>
  );
}
