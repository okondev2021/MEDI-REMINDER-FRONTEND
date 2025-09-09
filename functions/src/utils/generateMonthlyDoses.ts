import { Timestamp } from "firebase-admin/firestore";
import { GenerateMonthlyDosesParams, DosesScheduleProps } from "./types";
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
          lastNotifiedAt: null,
        });
      }
    }
  }

  return doses;
}
