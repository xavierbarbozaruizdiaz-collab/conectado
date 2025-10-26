'use client';

import { useMemo } from 'react';
import { useCollection, collection, query, where } from '@/firebase';
import { useParams } from 'next/navigation';

export default function TiendaPage() {
  // 1) Normalizar slug
  const params = useParams() as Record<string, string | string[]>;
  const slug =
    typeof params?.slug === 'string'
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : '';

  // 2) Traer vendor por slug (siempre paso una query válida)
  const vendorsQuery = useMemo(
    () => query(collection('vendors'), where('slug', '==', slug)),
    [slug]
  );
  const { data: vendorsRaw } = useCollection(vendorsQuery);
  const vendors = Array.isArray(vendorsRaw) ? vendorsRaw : [];

  const sellerId = vendors[0]?.id ?? null;

  // 3) Traer productos del vendor
  //    Si no hay sellerId, en vez de pasar null al hook, devolvemos []
  const productsQuery = useMemo(() => {
    if (!sellerId) return null;
    return query(collection('products'), where('sellerId', '==', sellerId));
  }, [sellerId]);

  // Si tu `useCollection` NO soporta null, usamos este patrón:
  const { data: prodsRaw } = useCollection(
    productsQuery ?? query(collection('products'), where('sellerId', '==', '__none__'))
  );
  const prods = Array.isArray(prodsRaw) ? prodsRaw : [];

  if (!vendors.length) {
    // Aún cargando vendor (o no encontrado)
    return <div className="p-6">Cargando...</div>;
  }

  const vendor = vendors[0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{vendor?.displayName ?? 'Tienda'}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {prods.map((p: any) => {
          const cover =
            Array.isArray(p?.images) && p.images.length > 0
              ? p.images[0]
              : '/placeholder.png'; // asegúrate de tenerlo en /public

          return (
            <div key={p?.id} className="rounded-xl border p-4 bg-card">
              <img
                src={cover}
                alt={p?.title ?? 'Producto'}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <div className="font-medium">{p?.title ?? 'Producto'}</div>
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


