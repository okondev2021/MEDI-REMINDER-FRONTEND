import { onSchedule } from "firebase-functions/v2/scheduler";
import { fetch } from "undici";
import { defineSecret } from "firebase-functions/params";


// Configurable parameters
const CONFIG = {
  schedule: "every 2 minutes",
  timeZone: "UTC",
  missedDoseThresholdHours: 4,
  batchMaxOperations: 500,
  // 
  notifyCooldownMins: 4, 
  timeWindowMins: [-15, -10, -5, 0, 5, 10],
};


// 
type SendMissedDoseEmailParams = {
  toEmail: string;
  firstName: string;
  caregiver?: string;
  medicationName: string;
  scheduledTime: string;
  forCaregiver: boolean;
};


// 
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");


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
      .limit(CONFIG.batchMaxOperations)
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
                headers: {
                  Urgency: "high",
                },
                notification: {
                  icon: "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
                  vibrate: [300, 100, 400],
                  sound:
                    "https://res.cloudinary.com/dcpbyncni/video/upload/v1752652597/alarm_w8z7u2.mp3",
                  badge:
                    "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
                  requireInteraction: true,
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
                  tag: "alarm",
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


// 
const CaregiverMissedDoseHtml = ({
  firstName,
  caregiver,
  medicationName,
  scheduledTime,
  forCaregiver,
}: {
  firstName: string;
  caregiver?: string;
  medicationName: string;
  scheduledTime: string;
  forCaregiver: boolean;
  }) => {
  return forCaregiver
    ? `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Missed Medication Alert</h2>
        <p>Hello ${caregiver},</p>
        <p>This is to inform you that <strong>${firstName}</strong> missed their scheduled dose of <strong>${medicationName}</strong> at <strong>${scheduledTime}</strong>.</p>
        <p>Please consider checking in on them to ensure everything is okay and assist if needed.</p>
        <p>Your care makes a difference.<br>— The MediRemind Team</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin-top: 20px;">
        <small style="color: #888;">This is an automated message. Please do not reply directly to this email.</small>
      </div>

    `
    : `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #d9534f;">Missed Dose Alert</h2>
        <p>Hi ${firstName},</p>
        <p>We noticed you missed your scheduled dose of <strong>${medicationName}</strong> at <strong>${scheduledTime}</strong>.</p>
        <p>Your health is important to us. Please take your medication as soon as possible unless advised otherwise by your healthcare provider.</p>
        <p>If you've already taken the dose, you can update this in the MediRemind app.</p>
        <p style="margin-top: 1.2em;">Stay safe and take care,</p>
        <p>Your care makes a difference.<br>— The MediRemind Team</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin-top: 20px;">
        <small style="color: #888;">This is an automated message. Please do not reply directly to this email.</small>
      </div>
  `;
}


// 
const sendMissedDoseEmail = async ({
  toEmail,
  firstName,
  caregiver,
  medicationName,
  scheduledTime,
  forCaregiver,
}: SendMissedDoseEmailParams) => {
  const html = CaregiverMissedDoseHtml({
    firstName,
    caregiver,
    medicationName,
    scheduledTime,
    forCaregiver,
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY.value()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "MediRemind <onboarding@resend.dev>",
      to: toEmail,
      subject: "Missed Medication Alert",
      html: html,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Send failed:", result);
    throw new Error("Email failed to send");
  } else {
    console.log("Email sent successfully:");
  }

  return { success: true, result };
};


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
    const {getAuth} = await import("firebase-admin/auth");

    if (!getApps().length) {
      initializeApp();
    }
    const startTime = Date.now();
    const db = getFirestore();
    const auth = getAuth();
    let totalMarked = 0;
    let batch = db.batch();
    let batchOperations = 0;

    try {

      console.log("🚀 Starting markMissedDoses function");

      const usersSnapshot = await db
        .collection("userProfile")
        .limit(CONFIG.batchMaxOperations)
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

              // Only send if caregiver email exists

              const caregiverEmail = userData?.caregivers.email;

              if (caregiverEmail) {

                // get caregiver auth info
                const caregiverRecord = await auth.getUser(userData?.caregivers?.uid || "");
                const caregiverDisplayName = caregiverRecord.displayName;

                // get user auth info
                const patientRecord = await auth.getUser(userDoc.id || "");
                const patientDisplayName = patientRecord.displayName;
                
                try {
                  // notify caregiver
                  const formattedTime = doseDateTime.toFormat("fff");

                  await sendMissedDoseEmail({
                    toEmail: caregiverEmail,
                    firstName: patientDisplayName || "User",
                    caregiver: caregiverDisplayName || "Caregiver",
                    medicationName:
                      medDoc.data()?.medicationInformation?.name ||
                      "Medication",
                    scheduledTime: formattedTime,
                    forCaregiver: true
                  });

                  // notify patient
                  console.log(patientRecord.email, patientRecord);
                  await sendMissedDoseEmail({
                    toEmail: patientRecord.email || "",
                    firstName: patientDisplayName || "User",
                    medicationName:
                      medDoc.data()?.medicationInformation
                        ?.name || "Medication",
                    scheduledTime: formattedTime,
                    forCaregiver: false,
                  });

                  console.log(
                    `📧 Sent missed dose alert to caregiver successfully for dose`
                  );

                }
                catch (err) {
                  console.error(
                    `Failed to send email for dose ${doseDoc.id}:`,
                    err
                  );
                }
              }
              // end of email

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

