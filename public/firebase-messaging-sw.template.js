self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js"
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

  console.table(payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationBody = payload.notification?.body || "";

  // Notification options with both vibration and sound
  const notificationOptions = {
    body: notificationBody,
    icon: "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
    vibrate: [
      200, 100, 200, 100, 200, 100, 200, 200, 100, 200, 100, 200, 100, 200,
    ],
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

self.addEventListener("notificationclick", function (event) {
  const clickedNotification = event.notification;

  clickedNotification.close();

  const notificationAction = event.action;

  console.log("Notification click received:", event);

  const { medId, doseId, medicationInstructions, medicationName } =
    event.notification.data || {};
  const baseURL = self.location.origin;

  // Build the target URL
  const targetUrl = `${baseURL}/?alarm=true&medId=${encodeURIComponent(
    medId
  )}&doseId=${encodeURIComponent(doseId)}&medicationName=${encodeURIComponent(
    medicationName
  )}&medicationInstructions=${encodeURIComponent(medicationInstructions)}`;

  if (notificationAction === "take") {
    console.log("User clicked 'Take' action");
    // Handle the 'Take' action
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url.startsWith(baseURL) && "focus" in client) {
              client.focus();
              // Send message to open the page inside app
              client.postMessage({
                type: "NAVIGATE_TO_ALARM",
                targetUrl,
              });
              return;
            }
          }

          // If no open window found, open new one
          if (clients.openWindow) {
            return clients.openWindow(targetUrl);
          }
        })
    );
  }
  

});

self.addEventListener("notificationclose", (event) => {
  console.log("Notification was dismissed", event.notification);
});
