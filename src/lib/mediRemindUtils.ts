import {
  GenerateMonthlyDosesParams,
  DosesScheduleProps,
  GroupedDosesProps,
} from "./types";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";

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
          notificationSent: false,
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
