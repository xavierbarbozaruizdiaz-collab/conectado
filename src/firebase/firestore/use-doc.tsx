
'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import type {
  Firestore,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import { onSnapshot, doc } from 'firebase/firestore';
import { useFirestore } from '../';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';


export function useDoc<T = DocumentData>(
  docRef: DocumentReference | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const unsubscribeRef = useRef<() => void>();

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }
    
    // Unsubscribe from the previous listener if it exists
    if (unsubscribeRef.current) {
        unsubscribeRef.current();
    }

    try {
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
  }, [docRef]);

  return { data, loading, error };
}

// Re-export doc from firestore to be used in components
export { doc as docRef } from 'firebase/firestore';
