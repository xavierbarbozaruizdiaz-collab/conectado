
'use client';

import { useEffect, useState, useRef } from 'react';
import type {
  Firestore,
  CollectionReference,
  DocumentData,
  Query,
} from 'firebase/firestore';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { useFirestore } from '../';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

interface UseCollectionOptions {
  // Define any options here, e.g., for filtering or sorting
}

export function useCollection<T = DocumentData>(
  collectionQuery: Query | null
) {
  const firestore = useFirestore() as Firestore;
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const unsubscribeRef = useRef<() => void>();

  useEffect(() => {
    // Si la consulta es null, no hacemos nada y reseteamos el estado.
    if (!firestore || !collectionQuery) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    
    setLoading(true);

    if (unsubscribeRef.current) {
        unsubscribeRef.current();
    }

    try {
      const unsubscribe = onSnapshot(
        collectionQuery,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          setData(items);
          setLoading(false);
        },
        (err) => {
          const path = (collectionQuery as any)._query?.path?.segments.join('/') || 'unknown path';
          const permissionError = new FirestorePermissionError({
            path: path,
            operation: 'list'
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
          setLoading(false);
        }
      );
      
      unsubscribeRef.current = unsubscribe;

    } catch (e: any) {
        setError(e);
        setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
        if(unsubscribeRef.current) {
            unsubscribeRef.current();
        }
    }
  }, [firestore, collectionQuery]);

  return { data, loading, error };
}

// Re-export collection from firestore to be used in components
export { collection, query, where, orderBy, limit };

    