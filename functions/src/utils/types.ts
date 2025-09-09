import { Timestamp } from "firebase-admin/firestore";

export interface DosesScheduleProps {
  id?: string;
  userId: string;
  medicationId: string;
  medicationName: string;
  medicationStrength: string;
  medicationInstruction: string;
  date: string;
  time: string;
  taken: boolean;
  missed: boolean;
  Timestamp: Timestamp;
  notificationSent: boolean;
  takenAt: Timestamp;
  lastNotifiedAt: Timestamp | null;
}


export interface MedicationInfo {
  id: string;
  name: string;
  instruction: string;
  strength: string;
}


export interface GenerateMonthlyDosesParams {
  startDate: string; // "YYYY-MM-DD"
  selectedDays: string[]; // ['monday', 'wednesday', ...]
  timeSlots: string[]; // ['08:00', '12:30', ...]
  medicationInfo: MedicationInfo;
  userId: string;
}
