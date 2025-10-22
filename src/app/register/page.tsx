
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LogoIcon from '@/components/logo-icon';
import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function RegisterPage() {
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    if (!auth || !firestore) {
        setIsSubmitting(false);
        return;
    };
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: storeName });

      // Create user profile in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        storeName: storeName,
        storeDescription: '',
        profilePictureUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
        bannerUrl: `https://picsum.photos/seed/${user.uid}/1200/400`,
        whatsappNumber: '',
        subscriptionTier: 'Gratis', // Default tier
      };
      
      await setDoc(userRef, userData, { merge: true });

      toast({
        title: '¡Cuenta Creada!',
        description: 'Tu cuenta ha sido creada exitosamente.',
      });
      router.push('/dashboard/seller');
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado. Intenta iniciar sesión.');
      } else if (e.code === 'firestore/permission-denied') {
         const permissionError = new FirestorePermissionError({ path: `users/${(auth.currentUser?.uid || 'unknown')}`, operation: 'create' });
         errorEmitter.emit('permission-error', permissionError);
         setError('Error de permisos al crear el perfil. Contacta a soporte.');
      } else {
        logger.error(e, { component: 'RegisterPage' });
        setError('No se pudo crear la cuenta. Inténtalo de nuevo.');
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth || !firestore) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

       // Create or update user profile in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        storeName: user.displayName,
        storeDescription: '',
        profilePictureUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
        bannerUrl: `https://picsum.photos/seed/${user.uid}/1200/400`,
        whatsappNumber: '',
        subscriptionTier: 'Gratis', // Default tier
      };
      
      setDoc(userRef, userData, { merge: true }).catch(e => {
        const permissionError = new FirestorePermissionError({ path: `users/${user.uid}`, operation: 'create' });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({ title: '¡Bienvenido!' });
      router.push('/dashboard/seller');
    } catch (e: any) {
       if (e.code === 'auth/account-exists-with-different-credential') {
           setError('Ya existe una cuenta con este email pero con un método de inicio de sesión diferente.');
       } else {
           logger.error(e, { component: 'RegisterPage', flow: 'GoogleLogin' });
           setError('No se pudo registrar con Google.');
       }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-4">
            <LogoIcon className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="text-2xl">Crear una Cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos para empezar a vender y comprar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-500/10 border-blue-500/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                  El plan gratuito te permite publicar hasta 5 productos. <Link href="/pricing" className="font-bold underline">Ver planes</Link>.
              </AlertDescription>
          </Alert>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="store-name">Nombre de la Tienda</Label>
              <Input
                id="store-name"
                placeholder="Ej: Tienda de Ana"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
             {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin} disabled={isSubmitting}>
              Registrarse con Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline">
              Acceder
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
