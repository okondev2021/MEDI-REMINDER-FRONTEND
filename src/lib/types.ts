import { Timestamp } from "firebase/firestore";

export const USER_ROLES = {
  PATIENT: "patient",
  CAREGIVER: "caregiver",
  BLANK: "",
} as const;

export type UserType = (typeof USER_ROLES)[keyof typeof USER_ROLES];


interface roleInfo {
  email: string;
  uid: string;
}
export interface UserProfile {
  birthDate: string;
  dateJoined: Timestamp;
  emailNotification: boolean;
  healthConditions: string[];
  notificationReminderTiming: number;
  pushNotification: boolean;
  timezone: string;
  userType: UserType;
  fcmToken: string;
  patients?: roleInfo;
  caregivers?: roleInfo;
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


export interface CareGiverInvitations {
  id: string;
  caregiverEmail: string;
  patientId: string;
  patientEmail: string
  request_accepted: boolean;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}


