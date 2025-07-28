importScripts(
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js"
);


const firebaseConfig = {
  apiKey: "%%VITE_API_KEY%%",
  authDomain: "%%VITE_AUTH_DOMAIN%%",
  projectId: "%%VITE_PROJECT_ID%%",
  storageBucket: "%%VITE_STORAGE_BUCKET%%",
  messagingSenderId: "%%VITE_MESSAGING_SENDER_ID%%",
  appId: "%%VITE_APP_ID%%",
  measurementId: "%%VITE_MEASUREMENT_ID%%",
};


firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {

  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle =
    payload.webpush.notification?.title || "New Notification";
  const notificationBody = payload.webpush.notification?.body || "";

  // Notification options with both vibration and sound
  const notificationOptions = {
    body: notificationBody,
    icon: "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    data: payload.data || {},
    requireInteraction: true,
    tag: `Medication alarm ${payload.data.medicationName}`,
    renotify: true,
    badge:
      "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
    actions: [
      {
        action: "take",
        title: "✅ Take",
      },
      {
        action: "snooze",
        title: "⏰ Snooze",
      },
    ],
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
  
});


self.addEventListener('install', (event) => {
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", function (event) {
   
  event.notification.close();

  const { medId, doseId, medicationInstructions, medicationName } =
    event.notification.data || {};
  const targetUrl = `/?alarm=true&medId=${medId}&doseId=${doseId}&medicationName=${medicationName}&medicationInstructions=${medicationInstructions}`;

  if (event.action === "take") {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          let clientToFocus = null;

          for (const client of clientList) {
            // Check if a client (tab/window) for your origin is already open
            // You might make this less strict than client.url === "/" if your app has other main routes
            if (client.url.startsWith(self.location.origin)) {
              // Check if it's within your PWA's origin
              clientToFocus = client;
              break; // Found one, break loop
            }
          }

          if (clientToFocus && "focus" in clientToFocus) {
            // If an existing client is found, navigate it to the target URL and focus it
            return clientToFocus
              .navigate(targetUrl)
              .then(() => clientToFocus.focus());
          } else {
            // If no suitable client is found, open a new window
            return clients.openWindow(targetUrl);
          }
        })
    );
  }

  if (!event.action) {
    // Default click (not an action button)
    event.waitUntil(clients.openWindow(targetUrl));
  }
});


self.addEventListener("notificationclose", (event) => {
  console.log("Notification was dismissed", event.notification);
});

