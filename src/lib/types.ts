import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  birthDate: string;
  dateJoined: Timestamp;
  emailNotification: boolean;
  healthConditions: string[];
  notificationReminderTiming: number;
  pushNotification: boolean;
  timezone: string;
  userType: string;
  fcmToken: string;
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
  status: string;
}

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

export interface GroupedDosesProps {
  time: string;
  medications: DosesScheduleProps[];
}
