


export interface MedicationInfo  {
  id: string;
  name: string;
  instruction: string;
  strength: string;
};

export interface Dose {
  userId: string;
  medicationId: string;
  medicationName: string;
  medicationStrength: string;
  medicationInstruction: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  utcDateTime: string;
  taken: boolean;
  notificationSent: boolean;
};

export interface GenerateMonthlyDosesParams{
  startDate: string; // "YYYY-MM-DD"
  selectedDays: string[]; // ['monday', 'wednesday', ...]
  timeSlots: string[]; // ['08:00', '12:30', ...]
  medicationInfo: MedicationInfo;
  userId: string;
};

export interface MedicationProps {
  id: string;
  medicationInformation: {
    instructions: string;
    medicationStrength: string;
    name: string;
    startDate: string;
  };
  schedule: {
    days: string[];
    timeSlots: string[];
    type: string;
  };
  status: string
}

export interface DosesScheduleProps {
  id: string;
  date: string;
  medicationId: string;
  medicationInstruction: string;
  medicationName: string;
  medicationStrength: string;
  notificationSent: boolean;
  taken: boolean;
  time: string;
  userId: string;
  utcDateTime: string;
}


export interface GroupedDailyDosesProps {
  time: string;
  medications: DosesScheduleProps[]
}
  


