import { GenerateMonthlyDosesParams, Dose } from "./types";

export function generateMonthlyDoses({
  startDate,
  selectedDays,
  timeSlots,
  medicationInfo,
  userId,
}: GenerateMonthlyDosesParams): Dose[] {
  const doses: Dose[] = [];

  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 30);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

    console.log(d);
    
    const dayName = d
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    if (selectedDays.includes(dayName)) {
      for (const time of timeSlots) {
        doses.push({
          userId,
          medicationId: medicationInfo.id,
          medicationName: medicationInfo.name,
          date: d.toISOString().split("T")[0],
          time,
          taken: false,
          notificationSent: false,
        });
      }
    }
  }

  return doses;
}

