import { first } from '@/lib/safe';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { db } from '@/firebase'; // tu instancia

export default function TiendaPage({ params }: { params: { slug: string } }) {
  const vendorsQ = query(
    collection(db, 'vendors'),
    where('slug', '==', params.slug),
  );
  const { data: vendors } = useCollection<any>(vendorsQ);

  const vendor = first<any>(vendors);
  const sellerId = vendor?.id ?? null;

  const productsQ = sellerId
    ? query(collection(db, 'products'), where('sellerId', '==', sellerId))
    : null;

  const { data: products } = useCollection<any>(productsQ);

  if (!vendor) return <div className="p-6">Cargando…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{vendor.displayName ?? 'Tienda'}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p: any) => {
          const cover = first<string>(p?.images, '/placeholder.png');
          return (
            <div key={p.id} className="rounded-xl border p-4 bg-card">
              <img src={cover} alt={p?.title ?? 'Producto'} className="w-full h-48 object-cover rounded-md mb-3" />
              <div className="font-medium">{p?.title ?? '—'}</div>
              <div className="text-sm text-muted-foreground">
                {typeof p?.price === 'number' ? `$${p.price}` : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


