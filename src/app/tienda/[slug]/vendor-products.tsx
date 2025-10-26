'use client';

import Link from 'next/link';
import { useCollection, collection, query, where, orderBy } from '@/firebase';

export default function VendorProducts({ slug }: { slug: string }) {
  // Traemos info de la tienda y sus productos
  const vendors = useCollection(query(collection('vendors'), where('slug', '==', slug)));
  const products = useCollection(
    query(
      collection('products'),
      where('vendorSlug', '==', slug),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    )
  );

  const vendor = vendors.data?.[0]?.data() as any | undefined;

  if (vendors.loading || products.loading) return <div className="container mx-auto px-4 py-8">Cargando…</div>;
  if (vendors.error || products.error) return <div className="container mx-auto px-4 py-8 text-destructive">Error cargando tienda.</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src={vendor?.logoUrl || 'https://dummyimage.com/64x64/e5e5e5/333&text=MX'}
            alt={vendor?.displayName || slug}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">
              {vendor?.displayName || slug}
            </h1>
            <div className="text-xs text-muted-foreground">@{slug}</div>
          </div>
        </div>
        <Link href="/tiendas" className="text-sm text-primary hover:underline">← Todas las tiendas</Link>
      </div>

      {!products.data?.length ? (
        <div>Esta tienda todavía no tiene productos.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.data.map((doc) => {
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
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
