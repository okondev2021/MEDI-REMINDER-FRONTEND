import { getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { appDb, messaging } from "./firebase";
import { getSwRegistration } from "./swRegistration";

export const requestNotificationPermission = async (
  
  userId:string

): Promise<void> => {
  try {
    
    try {

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.warn("Notification permission not granted.");
        return;
      }

      const swRegistration = await getSwRegistration();
      
      if (!swRegistration) {
        console.error("Service Worker not registered.");
        return;
      }
      
      const fcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
      });

      if (fcmToken) {
        console.log("current token for client: ", fcmToken);
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
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        console.warn("⚠️ No FCM token received.");
      }
    }
    catch (err) {
      console.log("An error occurred while retrieving token. ", err);
    }

  }

  catch (err: unknown) {
    console.error("❌ Error getting notification permission:", err);
  }
};