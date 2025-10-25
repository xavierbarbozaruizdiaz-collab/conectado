
// src/firebase/index.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, writeBatch } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// ⬇️  Config via ENV (Vercel / .env.local)
//    Asegúrate de tener estas variables creadas en Vercel:
//    NEXT_PUBLIC_FIREBASE_API_KEY
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//    NEXT_PUBLIC_FIREBASE_APP_ID
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Hooks
export { useCollection, collection, query, where, orderBy } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
export {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  useStorage,
} from './provider';

// Providers
export { FirebaseProvider } from './provider';
export { FirebaseClientProvider } from './client-provider';

// Firestore methods
export { doc, updateDoc } from 'firebase/firestore';
export { writeBatch };

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
  } else {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
  }
  return { app, auth, firestore, storage };
}
