export interface MedicationInfo  {
  id: string;
  name: string;
};

export interface Dose {
  userId: string;
  medicationId: string;
  medicationName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
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
