// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicialización segura de la App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inicialización de la base de datos Firestore (Funciona en servidor y cliente)
const db = getFirestore(app);

export { db };

/**
 * Función utilitaria para solicitar permisos de notificación.
 * Al usar importaciones dinámicas dentro de la función, garantizamos que el SDK
 * de Messaging nunca se cargue en el servidor de Next.js.
 */
export const requestNotificationPermission = async () => {
  // 1. Blindaje contra SSR: Si no hay 'window', salir inmediatamente sin romper nada
  if (typeof window === "undefined") return null;

  try {
    // 2. Importación dinámica de los módulos de mensajería (Solo se cargan en el cliente)
    const { getMessaging, getToken, isSupported } = await import("firebase/messaging");

    // 3. Validar si el navegador real soporta las APIs nativas de Push
    const supported = await isSupported();
    if (!supported) {
      console.log("Las notificaciones Push no son soportadas en este navegador.");
      return null;
    }

    const messaging = getMessaging(app);
    
    // 4. Solicitar el permiso nativo al usuario
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // 5. Obtener el Token usando la variable de entorno de tu clave VAPID
      const token = await getToken(messaging, { 
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
      });
      return token;
    } else {
      console.log('Permiso de notificaciones denegado por el usuario.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el token de notificación:', error);
    return null;
  }
};