'use client';

import Link from 'next/link';
import { useCollection, collection, orderBy, query } from '@/firebase';

export default function TiendasPage() {
  const { data, loading, error } = useCollection(
    query(collection('vendors'), orderBy('displayName', 'asc'))
  );

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando tiendas…</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-destructive">Error: {String(error)}</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Tiendas</h1>
      {!data?.length ? (
        <div>No hay tiendas registradas todavía.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((doc) => {
            const v = doc.data() as any;
            return (
              <Link key={doc.id} href={`/tienda/${v.slug}`} className="border rounded-xl p-4 hover:shadow">
                <div className="flex items-center gap-3">
                  <img
                    src={v.logoUrl || 'https://dummyimage.com/64x64/e5e5e5/333&text=MX'}
                    alt={v.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{v.displayName}</div>
                    <div className="text-xs text-muted-foreground">@{v.slug}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
