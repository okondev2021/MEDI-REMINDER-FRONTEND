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

  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationBody = payload.notification?.body || "";

  // Notification options with both vibration and sound
  const notificationOptions = {
    body: notificationBody,
    icon:
      payload.notification?.icon ||
      "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
    vibrate: [300, 100, 400],
    data: payload.data || {},
    requireInteraction: true,
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

  // Play sound if alarm is requested
  if (payload.data?.alarm === "true") {
    // Method 1: Using the Web Notifications API sound property (works in some browsers)
    notificationOptions.sound =
      "https://res.cloudinary.com/dcpbyncni/video/upload/v1752652597/alarm_w8z7u2.mp3";

    // Method 2: Directly play the audio (more reliable cross-browser)
    self.registration.getNotifications().then(() => {
      const audio = new Audio(
        "https://res.cloudinary.com/dcpbyncni/video/upload/v1752652597/alarm_w8z7u2.mp3"
      );
      audio.play().catch((e) => console.log("Audio play failed:", e));
    });
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
  
});


// self.addEventListener("push", function (event) {

//   console.log("[SW] Push event received manually:", event);

//   let payload = {};
//   try {
//     payload = event.data.json();
//   } catch (e) {
//     console.error("Error parsing push payload:", e);
//   }

//   const notificationTitle = payload.notification?.title || "New Notification";
//   const notificationOptions = {
//     body: payload.notification?.body || "",
//     icon:
//       payload.notification?.icon ||
//       "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
//     vibrate: [300, 100, 400],
//     data: payload.data || {},
//     requireInteraction: true,
//     badge:
//       "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
//     actions: [
//       {
//         action: "take",
//         title: "✅ Take",
//       },
//       {
//         action: "snooze",
//         title: "⏰ Snooze",
//       },
//     ],
//   };

//   if (payload.data?.alarm === "true") {
//     notificationOptions.sound =
//       "https://res.cloudinary.com/dcpbyncni/video/upload/v1752652597/alarm_w8z7u2.mp3";
//   }

//   event.waitUntil(
//     self.registration.showNotification(notificationTitle, notificationOptions)
//       .then(() => {
//       const audio = new Audio(
//         "https://res.cloudinary.com/dcpbyncni/video/upload/v1752652597/alarm_w8z7u2.mp3"
//       );
//       audio.play().catch((e) => console.log("Audio play failed:", e));
//     })
//   );
// });


self.addEventListener('install', (event) => {
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});


self.addEventListener('notificationclick', function (event) {
  
  event.notification.close();

  const { medicationId, doseId } = event.notification.data || {};

  const targetUrl = `/?alarm=true&medicationId=${medicationId}&doseId=${doseId}`;

  if (event.action === "take") {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          for (const client of clientList) {
            if (client.url === "/" && "focus" in client) {
              client.navigate(targetUrl);
              return client.focus();
            }
          }
        })
    );
  }
});


self.addEventListener("notificationclose", (event) => {
  console.log("Notification was dismissed", event.notification);
});




// // Handle notification click
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
  
//   const urlToOpen = new URL("/", self.location.origin).href;
  
//   // Handle different notification actions
//   if (event.action === "take") {
//     event.waitUntil(
//       clients.matchAll({ type: "window" }).then((windowClients) => {
//         const matchingClient = windowClients.find(
//           (client) => client.url === urlToOpen
//         );
//         if (matchingClient) {
//           return matchingClient.focus();
//         }
//         return clients.openWindow(urlToOpen);
//       })
//     );
//   }

// });