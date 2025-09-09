import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import * as nodemailer from "nodemailer";


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
type SendDoseEmailParams = {
  toEmail: string;
  firstName: string;
  caregiver?: string;
  medicationName: string;
  scheduledTime: string;
  forCaregiver: boolean;
  isMissed: boolean;
  isReminder: boolean
};

// 
export const extendMedicationDoses = onSchedule(
  {
    schedule: "every day 01:00", // run daily at 1 AM UTC
    timeZone: "UTC",
  },
  async () => {
    const { initializeApp, getApps } = await import("firebase-admin/app");
    const { getFirestore, Timestamp } = await import(
      "firebase-admin/firestore"
    );
    const { DateTime } = await import("luxon");
    const { generateMonthlyDoses } = await import(
      "./utils/generateMonthlyDoses.js"
    );

    if (!getApps().length) {
      initializeApp();
    }
    const db = getFirestore();

    const usersSnapshot = await db.collection("userProfile").get();
    console.log(
      `🔍 Scanning ${usersSnapshot.size} users for expired medications`
    );

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      const medsSnapshot = await db
        .collection(`userProfile/${userId}/medications`)
        .where("status", "==", true) // only active meds
        .get();

      for (const medDoc of medsSnapshot.docs) {
        const medId = medDoc.id;
        const medData = medDoc.data();

        const { schedule, medicationInformation } = medData;
        if (!schedule?.selectedDays || !schedule?.timeSlots) {
          console.log(`⏩ Skipping ${medId} — missing schedule info`);
          continue;
        }

        const dosesRef = db.collection(
          `userProfile/${userId}/medications/${medId}/doses`
        );

        // Get the last scheduled dose
        const lastDoseSnap = await dosesRef
          .orderBy("Timestamp", "desc")
          .limit(1)
          .get();

        if (lastDoseSnap.empty) {
          console.log(`⚠️ No doses found for ${medId} (user ${userId})`);
          continue;
        }

        const lastDose = lastDoseSnap.docs[0].data();
        const lastDoseTime: Date = lastDose.Timestamp.toDate();
        const lastDoseDateTime = DateTime.fromJSDate(lastDoseTime);

        // Start new schedule the day AFTER last dose
        const newStartDate = lastDoseDateTime.plus({ days: 1 }).toISODate();
        const now = DateTime.utc();

        // Only extend if last dose has already passed
        if (lastDoseDateTime < now) {
          console.log(
            `⏰ Medication ${medId} (user ${userId}) expired at ${lastDoseTime.toISOString()} — generating new doses from ${newStartDate}`
          );

          const newDoses = generateMonthlyDoses({
            startDate: newStartDate ?? "",
            selectedDays: schedule.selectedDays,
            timeSlots: schedule.timeSlots,
            medicationInfo: {
              id: medId,
              name: medicationInformation?.name,
              instruction: medicationInformation?.instruction,
              strength: medicationInformation?.strength,
            },
            userId,
          });

          const batch = db.batch();
          for (const dose of newDoses) {
            const docRef = dosesRef.doc();
            batch.set(docRef, {
              ...dose,
              taken: false,
              missed: false,
              notificationSent: false,
              lastNotifiedAt: null,
              createdAt: Timestamp.fromDate(new Date()),
            });
          }
          await batch.commit();

          console.log(
            `✅ Extended doses for ${medId} (user ${userId}) — added ${newDoses.length} doses`
          );
        } else {
          console.log(
            `👌 Medication ${medId} (user ${userId}) still active — last dose is ${lastDoseTime.toISOString()}`
          );
        }
      }
    }

    console.log(`🎯 Done checking for expired medications`);
  }
);

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
    const { getAuth } = await import("firebase-admin/auth");

    // Initialize Firebase
    if (!getApps().length) {
      initializeApp();
    }
    const db = getFirestore();
    const auth = getAuth();
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

          // const lastNotified = doseData.lastNotifiedAt?.toDate?.();
          // if (lastNotified) {
          //   const lastNotifiedAt =
          //     DateTime.fromJSDate(lastNotified).setZone(userTimeZone);
          //   const minutesSinceLast = now.diff(
          //     lastNotifiedAt,
          //     "minutes"
          //   ).minutes;
          //   if (minutesSinceLast < CONFIG.notifyCooldownMins) {
          //     continue; // 🔁 Cooldown
          //   }
          // }

          try {

            let wasPushNotificationSent;
            let wasEmailNotificationSent;


            if (userData.pushNotification === true) {
              const response = await messaging.send({
                token: fcmToken,
                webpush: {
                  headers: {
                    Urgency: "high",
                  },
                  notification: {
                    title: "💊 Medication Reminder",
                    body: `It's time to take your medication: ${medicationName}`,
                    icon: "https://res.cloudinary.com/dcpbyncni/image/upload/v1752783406/icon512_rounded_xio6lb.png",
                    vibrate: [200, 100, 200, 100, 200, 100, 200],
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
                    tag: `Medication alarm ${medicationName}`,
                    renotify: true,
                  },
                },
                data: {
                  userId,
                  medId,
                  medicationName,
                  medicationInstructions:
                    medData?.medicationInformation?.instructions,
                  doseId: doseDoc.id,
                  time: doseDateTime.toISO() ?? "",
                  alarm: "true",
                },
              });

              wasPushNotificationSent = true;

              console.log(`📤 Notified ${userId} about dose ${doseDoc.id} (${timeDiffMins} mins from now). Msg ID: ${response}`);
            }

            if (userData.emailNotification === true && doseData.notificationSent !== true) {
              const patientRecord = await auth.getUser(
                userDoc.id || ""
              );
              const patientDisplayName = patientRecord.displayName;

              await sendMissedDoseEmail({
                toEmail: patientRecord.email || "",
                firstName: patientDisplayName || "User",
                medicationName:
                  medDoc.data()?.medicationInformation?.name ||
                  "Medication",
                scheduledTime: doseDateTime.toFormat("fff"),
                forCaregiver: true,
                isMissed: true,
                isReminder: false,
              });

              wasEmailNotificationSent = true;
            }


            if (wasPushNotificationSent || wasEmailNotificationSent) {
              await doseDoc.ref.update({
                lastNotifiedAt: Timestamp.fromDate(new Date()),
                notificationSent: true,
              });
            }
            
          }
          catch (err) {
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
  isMissed,
  isReminder,
}: {
  firstName: string;
  caregiver?: string;
  medicationName: string;
  scheduledTime: string;
  forCaregiver: boolean;
  isMissed: boolean;
  isReminder: boolean;
  }) => {
  
  const appUrl = defineSecret("DOMAIN_URL") || "#";
  return isReminder
    ? `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0275d8;">Medication Reminder</h2>
        <p>Hi ${firstName},</p>
        <p>This is a friendly reminder that it’s almost time to take your scheduled dose of <strong>${medicationName}</strong> at <strong>${scheduledTime}</strong>.</p>
        <p>Please make sure to take your medication on time for the best effect.</p>
        <p>
          <a href="${appUrl}" 
             style="display: inline-block; background: #0275d8; color: #fff; 
                    padding: 10px 16px; text-decoration: none; border-radius: 6px; 
                    margin-top: 12px;">
            Open MediRemind App
          </a>
        </p>
        <p style="margin-top: 1.2em;">Stay consistent and healthy,<br>— The MediRemind Team</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin-top: 20px;">
        <small style="color: #888;">This is an automated reminder. Please do not reply directly to this email.</small>
      </div>
  `
    : forCaregiver && isMissed
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
export const sendMissedDoseEmail = async ({
  toEmail,
  firstName,
  caregiver,
  medicationName,
  scheduledTime,
  forCaregiver,
  isMissed,
  isReminder,
}: SendDoseEmailParams) => {
  // Validate environment variables
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_PASS = process.env.GMAIL_PASS;

  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error(
      "Gmail credentials not configured in environment variables"
    );
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  // Build email body
  const html = CaregiverMissedDoseHtml({
    firstName,
    caregiver,
    medicationName,
    scheduledTime,
    forCaregiver,
    isMissed,
    isReminder,
  });

  try {
    // Send the email
    const info = await transporter.sendMail({
      from: `"MediRemind" <${GMAIL_USER}>`,
      to: toEmail,
      subject: isReminder
        ? "💊 Medication Reminder"
        : "⚠️ Missed Medication Alert",
      html,
    });

    console.log(`📧 Email sent to ${toEmail}: ${info.messageId}`);
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${toEmail}:`, error);
    throw new Error(`Email sending failed: ${error}`);
  } finally {
    // Close transporter
    transporter.close();
  }
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
                    forCaregiver: true,
                    isMissed: true,
                    isReminder: false
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
                    isMissed: true,
                    isReminder: false
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

// 