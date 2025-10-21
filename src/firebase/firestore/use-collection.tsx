
'use client';

import { useEffect, useState, useRef } from 'react';
import type {
  Firestore,
  CollectionReference,
  DocumentData,
  Query,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useFirestore } from '../';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

interface UseCollectionOptions {
  // Define any options here, e.g., for filtering or sorting
}

export function useCollection<T = DocumentData>(
  collectionPathOrRef: string | CollectionReference | Query | null
) {
  const firestore = useFirestore() as Firestore;
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const unsubscribeRef = useRef<() => void>();

  useEffect(() => {
    if (!firestore || !collectionPathOrRef) {
      setLoading(false);
      return;
    }
    
    // Unsubscribe from the previous listener if it exists
    if (unsubscribeRef.current) {
        unsubscribeRef.current();
    }

    try {
      const collectionRef =
        typeof collectionPathOrRef === 'string'
          ? collection(firestore, collectionPathOrRef)
          : collectionPathOrRef;

      const unsubscribe = onSnapshot(
        collectionRef as Query,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          setData(items);
          setLoading(false);
        },
        (err) => {
          const permissionError = new FirestorePermissionError({
            path: (collectionRef as CollectionReference).path,
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
  }, [firestore, collectionPathOrRef]);

  return { data, loading, error };
}

// Re-export collection from firestore to be used in components
import { collection } from 'firebase/firestore';
export { collection };
