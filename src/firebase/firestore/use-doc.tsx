
'use client';

import { useEffect, useState, useRef } from 'react';
import type {
  Firestore,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import { onSnapshot, doc } from 'firebase/firestore';
import { useFirestore } from '../';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

interface UseDocOptions {
  // Define any options here
}

export function useDoc<T = DocumentData>(
  docPathOrRef: string | DocumentReference | null
) {
  const firestore = useFirestore() as Firestore;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const unsubscribeRef = useRef<() => void>();

  useEffect(() => {
    if (!firestore || !docPathOrRef) {
      setLoading(false);
      return;
    }
    
    // Unsubscribe from the previous listener if it exists
    if (unsubscribeRef.current) {
        unsubscribeRef.current();
    }

    try {
      const docRef =
        typeof docPathOrRef === 'string'
          ? doc(firestore, docPathOrfRef)
          : docPathOrRef;

      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'get'
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
  }, [firestore, docPathOrRef]);

  return { data, loading, error };
}

// Re-export doc from firestore to be used in components
import { doc as docRef } from 'firebase/firestore';
export { docRef };
