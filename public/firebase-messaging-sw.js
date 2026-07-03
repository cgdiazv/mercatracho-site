importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Configuración idéntica a la de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyBRaKTPVdC-QhUykXgtCdv9-mb4BndTuiI",
  authDomain: "mercatracho-783f0.firebaseapp.com",
  projectId: "mercatracho-783f0",
  storageBucket: "mercatracho-783f0.firebasestorage.app",
  messagingSenderId: "77299731041",
  appId: "1:77299731041:web:77e93e352fe3cc7e707820"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Capturar el mensaje cuando la web no está abierta en primer plano
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Mercatracho: Última hora";
  const notificationOptions = {
    body: payload.notification?.body || "Haz clic para leer la noticia completa.",
    icon: '/icon.png', 
    badge: '/icon.png',
    data: {
      url: payload.data?.url || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar el clic del usuario en la burbuja de la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});