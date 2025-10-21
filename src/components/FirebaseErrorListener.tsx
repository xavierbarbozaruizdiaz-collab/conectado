
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import logger from '@/lib/logger';

// Este componente es una herramienta de desarrollo.
// Escucha errores de permisos de Firestore y los muestra en el overlay de Next.js
// para una depuración más sencilla de las reglas de seguridad.
export default function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      logger.error(error, {
        component: 'FirebaseErrorListener',
        context: error.context,
      });

      // Muestra un toast genérico al usuario final, pero el error detallado está en la consola.
      toast({
        variant: 'destructive',
        title: 'Error de Permiso',
        description:
          'No tienes permiso para realizar esta acción. Contacta al administrador si crees que es un error.',
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // Este componente no renderiza nada.
}
