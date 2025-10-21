
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, writeBatch } from 'firebase/firestore';

import { firebaseConfig } from './config';

// Hooks
export { useCollection, collection, query, where, orderBy } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
export {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
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

export function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  } else {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
  return { app, auth, firestore };
}
