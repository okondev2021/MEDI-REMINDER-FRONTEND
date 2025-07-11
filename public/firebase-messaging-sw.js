importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyATQpW8PcQ6pXrKM2n1wELueNfOEljWXzY",
  authDomain: "medi-remind-25b30.firebaseapp.com",
  projectId: "medi-remind-25b30",
  storageBucket: "medi-remind-25b30.firebasestorage.app",
  messagingSenderId: "1095936882055",
  appId: "1:1095936882055:web:9d7feca2986adbb3248f22",
  measurementId: "G-BZLP8HR6F4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Customize notification handler
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  // Customize notification
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "", //
    data: payload.data || {},
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// click handler for notifications
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Handle notification click
  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }

      // If no matching window/tab found, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
