import {
  GenerateMonthlyDosesParams,
  DosesScheduleProps,
  GroupedDosesProps,
  UserProfile
} from "./types";
import { DateTime } from "luxon";
import { appDb } from "./firebase";
import { toast } from "react-toastify";

import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore";

/**
 * Generates a list of doses for a month based on the provided parameters.
 * @param startDate - The start date in YYYY-MM-DD format.
 * @param selectedDays - Array of selected days (e.g., ['monday', 'wednesday']).
 * @param timeSlots - Array of time slots (e.g., ['08:00', '12:30']).
 * @param medicationInfo - Object containing basic medication information such as medication id, name, instruction, strength.
 * @param userId - User ID.
 * @returns Array of DosesScheduleProps objects (newly generated medication doeses for the next 30 days).
 */

export function generateMonthlyDoses({
  startDate,
  selectedDays,
  timeSlots,
  medicationInfo,
  userId,
}: GenerateMonthlyDosesParams): DosesScheduleProps[] {
  const doses: DosesScheduleProps[] = [];

  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 30);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayName = d
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    if (selectedDays.includes(dayName)) {
      for (const time of timeSlots) {
        const [hour, minute] = time.split(":").map(Number);

        doses.push({
          userId,
          medicationId: medicationInfo.id,
          medicationName: medicationInfo.name,
          medicationInstruction: medicationInfo.instruction,
          medicationStrength: medicationInfo.strength,
          date: d.toISOString().split("T")[0],
          time,
          Timestamp: Timestamp.fromDate(
            new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute)
          ),
          taken: false,
          missed: false,
          takenAt: Timestamp.fromDate(
            new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute)
          ),
          notificationSent: false,
          lastNotifiedAt: null
        });
      }
    }
  }

  return doses;
}

/**
 * Formats a new Date object to a date string in the format YYYY-MM-DD
 * @param date - Firestore Timestamp
 * @returns Formatted date string.
 * @example 2024-01-01
 */
export const formatDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

/**
 * Groups daily doses by time. creates an array of objects, each containing a time and an array of medications scheduled for that time.
 * @param doses - Firestore Timestamp
 * @returns GroupedDailyDosesProps[], the doses are groud by time
 * @example [
    {
      time: string;
      medications: DosesScheduleProps[];
    }
  ]
 */
export const groupDailyDosesByTime = (
  doses: DosesScheduleProps[]
): GroupedDosesProps[] => {
  const groupedDoses: GroupedDosesProps[] = [];
  let storedTime: string[] = [];

  doses.forEach((dose) => {
    if (!storedTime.includes(dose.time)) {
      storedTime.push(dose.time);
      groupedDoses.push({
        time: dose.time,
        medications: [dose],
      });
    } else {
      const matchedTime = groupedDoses?.find(
        (doseItem) => doseItem.time === dose.time
      );

      if (matchedTime) {
        matchedTime["medications"].push(dose);
      }
    }
  });

  const sortedGroupedDoses = groupedDoses.sort((a, b) => {
    const timeA = new Date(`2024-01-01T${a.time}:00`).getTime();
    const timeB = new Date(`2024-01-01T${b.time}:00`).getTime();

    return timeA - timeB;
  });

  return sortedGroupedDoses;
};




export const groupMedicationHistoryByDate = (
  doses: DosesScheduleProps[],
  timezone: string
): GroupedDosesProps[] => {
  const groupedMedicationDoses: GroupedDosesProps[] = [];
  let storedDay: string[] = [];

  doses.forEach((dose) => {
    const medicationTime = DateTime.fromJSDate(dose.Timestamp.toDate())
      .setZone(timezone)
      .startOf("day")
      .toFormat("yyyy-MM-dd");

    if (!storedDay.includes(medicationTime)) {
      storedDay.push(medicationTime);
      groupedMedicationDoses.push({
        time: medicationTime,
        medications: [dose],
      });
    } else {

      const matchedTime = groupedMedicationDoses?.find((doseItem) =>
        doseItem.time === medicationTime
      );

      if (matchedTime) {
        matchedTime["medications"].push(dose);
      }
    }
  });

  const sortedGroupedMedicationDoses = groupedMedicationDoses
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .map((group) => ({
      ...group,
      medications: group.medications.sort(
        (a, b) => a.Timestamp.toMillis() - b.Timestamp.toMillis()
      ),
    }));

  
  return sortedGroupedMedicationDoses;
};

/**
 * Converts a Firestore Timestamp to a formatted time string in the user's timezone
 * @param ts - Firestore Timestamp
 * @param timezone - IANA timezone string (e.g. "Africa/Lagos")
 * @param format - Luxon format string (optional)
 * @returns Formatted local time string.
 * @example  8:00 AM, 2:15 PM, etc.
 */
export const formatTimestampToUserTime = (
  ts: Timestamp,
  timezone: string,
  format = "hh:mm a" // Default format: "02:15 PM"
): string => {
  return DateTime.fromJSDate(ts.toDate(), { zone: "utc" })
    .setZone(timezone)
    .toFormat(format);
};

export const markDoseAsTaken = async (
  dose: DosesScheduleProps
) => {
  try {
    const now = new Date();

    const scheduledTime = dose.Timestamp.toDate();

    const earlyLimit = new Date(scheduledTime.getTime() - 30 * 60 * 1000); // 30 minutes before

    // const lateLimit = new Date(scheduledTime.getTime() + 3 * 60 * 60 * 1000); // 3 hrs after

    if (now < earlyLimit) {
      throw new Error(
        "It's too early to take this dose. Try again closer to the time."
      );
    }

    // PENDING REVIEW
    // if (now > lateLimit) {
    //   alert("⏰ This dose is too late to mark as taken.");
    //   return;
    // }

    const doseRef = doc(
      appDb,
      "userProfile",
      dose.userId,
      "medications",
      dose.medicationId,
      "doses",
      dose.id || ""
    );

    await updateDoc(doseRef, {
      taken: true,
      takenAt: Timestamp.now(),
    });

    toast.success("Dose marked as taken ✅");

    return { success: true };
  }
  catch (error) {
    toast.error(`Error marking dose as taken: ${error}`);
  }
};



export const fetchPatientTimezone = async (caregiverProfile: UserProfile) => {

  try {
    const patientUid = caregiverProfile.patients?.uid;

    if (!patientUid) {
      toast.error("No patient associated with this caregiver.");
      return null;
    }

    const patientDocRef = doc(appDb, "userProfile", patientUid);

    const patientDocSnap = await getDoc(patientDocRef);

    if (!patientDocSnap.exists()) {
      toast.error("Patient not found.");
      return null;
    }

    const patientData = patientDocSnap.data() as UserProfile;

    const timezone = patientData.timezone;

    return timezone;

  }
  catch (error) {
    toast.error(`Error fetching patient timezone: ${String(error)}`);
    return null;
  }
};

