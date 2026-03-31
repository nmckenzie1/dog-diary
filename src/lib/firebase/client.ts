import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0 && typeof window !== "undefined") {
  // Keep this warning client-side so local setup issues are visible immediately.
  console.warn(`Missing Firebase env vars: ${missingConfig.join(", ")}`);
}

function createFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
}

const isBrowser = typeof window !== "undefined";
const app = isBrowser ? createFirebaseApp() : null;

export const auth: Auth = isBrowser ? getAuth(app!) : (null as unknown as Auth);
export const db: Firestore = isBrowser ? getFirestore(app!) : (null as unknown as Firestore);
export const storage: FirebaseStorage = isBrowser
  ? getStorage(app!)
  : (null as unknown as FirebaseStorage);


