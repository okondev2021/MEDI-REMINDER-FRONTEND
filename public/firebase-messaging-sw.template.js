
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

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
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationBody = payload.notification?.body || "";
  
  // Notification options with both vibration and sound
  const notificationOptions = {
    body: notificationBody,
    icon:
      payload.notification?.icon ||
      "https://res.cloudinary.com/dcpbyncni/image/upload/v1751623295/SECONDARY_k2xftp.png",
    vibrate: [300, 100, 400], // Vibration pattern (ms)
    data: payload.data || {},
    requireInteraction: true, // Keep notification visible until dismissed
    actions: [
      { action: "open", title: "Open App" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  // Add sound if alarm is requested
  if (payload.data?.alarm === "true") {
    notificationOptions.sound = "/alarm.mp3"; // Path to your sound file
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  const urlToOpen = new URL("/schedule", self.location.origin).href;
  
  // Handle different notification actions
  if (event.action === "open") {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        const matchingClient = windowClients.find(
          (client) => client.url === urlToOpen
        );
        if (matchingClient) {
          return matchingClient.focus();
        }
        return clients.openWindow(urlToOpen);
      })
    );
  }
  // "dismiss" action requires no additional handling
});

// Optional: Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("Notification was dismissed", event.notification);
});
