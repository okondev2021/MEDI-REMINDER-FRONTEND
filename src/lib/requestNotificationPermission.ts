import { getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { appDb, messaging } from "./firebase";


// Call this after login, pass user.uid
export const requestNotificationPermission = async (userId: string) => {
  try {
    const permission = await Notification.requestPermission();

      if (permission === "granted") {
          
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        // Wait until the service worker is fully active and ready to handle push
        await navigator.serviceWorker.ready;

        const vapidKey = import.meta.env.VITE_VAPID_KEY;

        const fcmToken = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        });

        if (fcmToken) {
          // Save token to Firestore
          await setDoc(
            doc(appDb, "userProfile", userId),
            {
              fcmToken,
            },
            { merge: true }
          );

          console.log("✅ FCM token saved:");
        } else {
          console.warn("⚠️ No FCM token received.");
        }
      } else {
      console.warn("🚫 Notification permission denied.");
    }
  } catch (err) {
    console.error("❌ Error getting notification permission:", err);
  }
};
