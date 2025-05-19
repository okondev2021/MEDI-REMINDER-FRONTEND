import {
  GenerateMonthlyDosesParams,
  Dose,
  GroupedDailyDosesProps,
  DosesScheduleProps,
} from "./types";

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
    const dayName = d
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    if (selectedDays.includes(dayName)) {
      for (const time of timeSlots) {
        // Combine date + time into one local datetime string
        const [hour, minute] = time.split(":").map(Number);


        const utcDateTime = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          hour,
          minute
        ).toISOString(); // This gives the UTC version

        doses.push({
          userId,
          medicationId: medicationInfo.id,
          medicationName: medicationInfo.name,
          medicationInstruction: medicationInfo.instruction,
          medicationStrength: medicationInfo.strength,
          date: d.toISOString().split("T")[0],
          time,
          utcDateTime, 
          taken: false,
          notificationSent: false,
        });
      }
    }
  }

  return doses;
}



export const formatDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;



export const groupDailyDosesByTime = (
  doses: DosesScheduleProps[]
): GroupedDailyDosesProps[] => {
  const groupedDoses: GroupedDailyDosesProps[] = [];
  let storedTime: string[] = [];

  doses.forEach((dose) => {
    if (!storedTime.includes(dose.time)) {
      storedTime.push(dose.time)
      groupedDoses.push({
        time: dose.time,
        medications: [dose],
      });
    }
    else {
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