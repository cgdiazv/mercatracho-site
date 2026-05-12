// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase utilizando las variables de entorno de Next.js.
// Estas variables deben estar definidas tanto en tu .env.local 
// como en el panel de Environment Variables de Vercel.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicialización de la aplicación (Singleton pattern para evitar múltiples instancias en desarrollo)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inicialización de la base de datos Firestore
const db = getFirestore(app);

export { db };