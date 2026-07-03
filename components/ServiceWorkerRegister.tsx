"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
      const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

      const swUrl = `/firebase-messaging-sw.js?apiKey=${apiKey}&authDomain=${authDomain}&projectId=${projectId}&storageBucket=${storageBucket}&messagingSenderId=${messagingSenderId}&appId=${appId}`;

      navigator.serviceWorker.register(swUrl)
        .then((registration) => {
          console.log('Service Worker de Mercatracho registrado:', registration.scope);
        })
        .catch((err) => {
          console.error('Error al registrar el Service Worker:', err);
        });
    }
  }, []);

  return null; // Este componente no renderiza HTML, solo ejecuta el script
}