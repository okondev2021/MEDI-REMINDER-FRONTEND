importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();


// Customized notification handler
messaging.onBackgroundMessage((payload) => {

  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  // Customize notification
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon:
      payload.notification?.icon ||
      "https://res.cloudinary.com/dcpbyncni/image/upload/v1751623295/SECONDARY_k2xftp.png",
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
  const urlToOpen = "/schedule";

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