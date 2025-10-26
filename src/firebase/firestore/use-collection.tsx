'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  Query as FSQuery,
  Unsubscribe,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

/**
 * Hook seguro para escuchar una colección por Query.
 * - Acepta `null` y, en ese caso, devuelve `data=[]` y `loading=false`.
 * - Maneja unsubscribe al cambiar la query o desmontar.
 * - No lanza: coloca errores en `error` y deja `data=[]`.
 */
export function useCollection<T = any>(query: FSQuery | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    // Si llega null: no hay consulta -> devolver vacío y no suscribir
    if (!query) {
      // Limpia cualquier suscripción previa
      if (unsubRef.current) {
        try { unsubRef.current(); } catch { /* noop */ }
        unsubRef.current = null;
      }
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    // Cancelar suscripción anterior si existe
    if (unsubRef.current) {
      try { unsubRef.current(); } catch { /* noop */ }
      unsubRef.current = null;
    }

    setLoading(true);
    setError(null);

    try {
      const unsub = onSnapshot(
        query,
        (snap) => {
          const items = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];

          setData(items);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setData([]);
          setLoading(false);
        },
      );

      unsubRef.current = unsub;
    } catch (err) {
      setError(err);
      setData([]);
      setLoading(false);
    }

    return () => {
      if (unsubRef.current) {
        try { unsubRef.current(); } catch { /* noop */ }
        unsubRef.current = null;
      }
    };
  }, [query]);

  return { data, loading, error };
}

export default useCollection;
