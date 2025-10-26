'use client';

import { useCollection, collection } from '@/firebase';

export default function TiendasPage() {
  const { data, loading, error } = useCollection(collection('vendors'));
  if (loading) return <div className="p-6">Cargando tiendas…</div>;
  if (error)   return <div className="p-6 text-red-500">Error: {String(error)}</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((v: any) => (
        <a
          key={v.id}
          href={`/tienda/${v.slug}`}
          className="border rounded-xl p-4 hover:bg-accent"
        >
          <div className="font-semibold">{v.displayName}</div>
          <div className="text-sm text-muted-foreground">{v.slug}</div>
        </a>
      ))}
    </div>
  );
}
