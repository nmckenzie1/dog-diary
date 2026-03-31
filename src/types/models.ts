import { Timestamp } from "firebase/firestore";

export type Nullable<T> = T | null;

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: Nullable<string>;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
  currentYearTotal: number;
  currentYear: number;
};

export type DogLog = {
  id: string;
  userId: string;
  displayName: string;
  quantity: number;
  imageUrl: string;
  imagePath: string;
  note: Nullable<string>;
  loggedAt: Timestamp;
  year: number;
  createdAt: Timestamp;
};

export type YearlyTotal = {
  id: string;
  year: number;
  userId: string;
  displayName: string;
  total: number;
  mostRecentLoggedAt: Timestamp;
  updatedAt: Timestamp;
};

export type LogInput = {
  quantity: number;
  note: string;
  loggedAt: Date;
};

export type ChartPoint = {
  dateLabel: string;
  total: number;
};

