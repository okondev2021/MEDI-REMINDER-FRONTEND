import { onSchedule } from "firebase-functions/v2/scheduler";

// Configurable parameters
const CONFIG = {
  schedule: "every 2 minutes",
  timeZone: "UTC",
  missedDoseThresholdHours: 4,
  maxUsersPerRun: 500,
  batchMaxOperations: 500, 
  // 
  notifyCooldownMins: 4, 
  timeWindowMins: [-15, -10, -5, 0, 5, 10],
};



// DOSE NOTIFICATION
export const notifyUpcomingDoses = onSchedule(
  {
    schedule: CONFIG.schedule,
    timeZone: CONFIG.timeZone,
    memory: "256MiB",
  },
  async () => {
    // Lazy-load heavy dependencies inside the function
    const { initializeApp, getApps } = await import("firebase-admin/app");
    const { getFirestore, Timestamp } = await import("firebase-admin/firestore");
    const { getMessaging } = await import("firebase-admin/messaging");
    const { DateTime } = await import("luxon");

    // Initialize Firebase
    if (!getApps().length) {
      initializeApp();
    }
    const db = getFirestore();
    const messaging = getMessaging();

    // Original function logic below (unchanged)
    const start = Date.now();
    const usersSnapshot = await db
      .collection("userProfile")
      .limit(CONFIG.maxUsersPerRun)
      .get();

    console.log(`🔍 Scanning ${usersSnapshot.size} users`);

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const userTimeZone = userData.timezone;
      const fcmToken = userData.fcmToken;

      if (!userTimeZone || !fcmToken) {
        console.log(`⏩ Skipping ${userId} — Missing timezone or FCM token`);
        continue;
      }

      const now = DateTime.now().setZone(userTimeZone);

      const medsSnapshot = await db
        .collection(`userProfile/${userId}/medications`)
        .get();

      for (const medDoc of medsSnapshot.docs) {
        const medId = medDoc.id;
        const medData = medDoc.data();
        const medicationName =
          medData?.medicationInformation?.name || "your medication";

        const dosesSnapshot = await db
          .collection(`userProfile/${userId}/medications/${medId}/doses`)
          .where("taken", "==", false)
          .where("missed", "==", false)
          .get();

        for (const doseDoc of dosesSnapshot.docs) {
          const doseData = doseDoc.data();
          const doseTime = doseData.Timestamp?.toDate?.();

          if (!doseTime) {
            console.warn(`⚠️ Skipping dose ${doseDoc.id} — no Timestamp`);
            continue;
          }

          const doseDateTime =
            DateTime.fromJSDate(doseTime).setZone(userTimeZone);
          const timeDiffMins = Math.round(
            doseDateTime.diff(now, "minutes").minutes
          );

          if (
            timeDiffMins < CONFIG.timeWindowMins[0] ||
            timeDiffMins > CONFIG.timeWindowMins[CONFIG.timeWindowMins.length - 1]
          ) {
            continue; // ⏱ Not time yet
          }

          const lastNotified = doseData.lastNotifiedAt?.toDate?.();
          if (lastNotified) {
            const lastNotifiedAt =
              DateTime.fromJSDate(lastNotified).setZone(userTimeZone);
            const minutesSinceLast = now.diff(
              lastNotifiedAt,
              "minutes"
            ).minutes;
            if (minutesSinceLast < CONFIG.notifyCooldownMins) {
              continue; // 🔁 Cooldown
            }
          }

          try {
            const response = await messaging.send({
              token: fcmToken,
              notification: {
                title: "💊 Medication Reminder",
                body: `It's time to take your medication: ${medicationName}`,
              },
              webpush: {
                notification: {
                  icon: "https://res.cloudinary.com/dcpbyncni/image/upload/v1751623295/SECONDARY_k2xftp.png",
                  vibrate: [300, 100, 400],
                  sound: "/alarm.mp3",
                  // badge: "/badge.png",
                },
              },
              data: {
                userId,
                medId,
                doseId: doseDoc.id,
                time: doseDateTime.toISO() ?? "",
                alarm: "true",
              },
            });

            console.log(
              `📤 Notified ${userId} about dose ${doseDoc.id} (${timeDiffMins} mins from now). Msg ID: ${response}`
            );

            await doseDoc.ref.update({
              lastNotifiedAt: Timestamp.fromDate(new Date()),
              notificationSent: true,
            });
          } catch (err) {
            console.error(
              `❌ Failed to notify ${userId} dose ${doseDoc.id}`,
              err
            );
          }
        }
      }
    }

    console.log(`✅ Done. Duration: ${Date.now() - start}ms`);
  }
);

// MARK MISSED DOSES
export const markMissedDoses = onSchedule(
  
  {
    schedule: CONFIG.schedule,
    timeZone: CONFIG.timeZone,
  },

  async () => {

    const { initializeApp, getApps } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");
    const { DateTime } = await import("luxon");

    if (!getApps().length) {
      initializeApp();
    }
    const startTime = Date.now();
    const db = getFirestore();
    let totalMarked = 0;
    let batch = db.batch();
    let batchOperations = 0;

    try {

      console.log("🚀 Starting markMissedDoses function");

      const usersSnapshot = await db
        .collection("userProfile")
        .limit(CONFIG.maxUsersPerRun)
        .get();

      console.log(`🔍 Found ${usersSnapshot.size} users to process`);

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        if (!userData.timezone) {
          console.log(`⏩ Skipping user ${userId} - no timezone set`);
          continue;
        }

        const userTimeZone = userData.timezone;
        const now = DateTime.now().setZone(userTimeZone);
        const thresholdTime = now.minus({
          hours: CONFIG.missedDoseThresholdHours,
        });

        const medsSnapshot = await db
          .collection(`userProfile/${userId}/medications`)
          .get();

        for (const medDoc of medsSnapshot.docs) {
          const medId = medDoc.id;
          const dosesSnapshot = await db
            .collection(`userProfile/${userId}/medications/${medId}/doses`)
            .where("taken", "==", false)
            .where("missed", "==", false)
            .get();

          for (const doseDoc of dosesSnapshot.docs) {
            const dose = doseDoc.data();
            const doseTime = dose.Timestamp?.toDate?.();

            if (!doseTime) {
              console.log(`⏩ Skipping dose ${doseDoc.id} - no timestamp`);
              continue;
            }

            const doseDateTime =
              DateTime.fromJSDate(doseTime).setZone(userTimeZone);

            if (doseDateTime <= thresholdTime) {
              batch.update(doseDoc.ref, { missed: true });
              batchOperations++;
              totalMarked++;

              if (batchOperations >= CONFIG.batchMaxOperations) {
                console.log(`✍️ Writing batch of ${batchOperations} updates`);
                await batch.commit();
                batch = db.batch();
                batchOperations = 0;
              }

              console.log(
                `🟡 Marked missed → user=${userId}, med=${medId}, dose=${doseDoc.id}, ` +
                  `scheduled=${doseDateTime.toISO()}, threshold=${thresholdTime.toISO()}`
              );
            }
          }
        }
      }

      // Commit any remaining operations in the batch
      if (batchOperations > 0) {
        console.log(`✍️ Writing final batch of ${batchOperations} updates`);
        await batch.commit();
      }

      console.log(
        `✅ markMissedDoses completed. Marked ${totalMarked} doses as missed. ` +
          `Execution time: ${Date.now() - startTime}ms`
      );
    } catch (error) {
      console.error("❌ Error in markMissedDoses:", error);
      throw error;
    }
  }

);






