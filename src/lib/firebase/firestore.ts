import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Transaction,
} from "firebase/firestore";
import type { User } from "firebase/auth";

import { db } from "@/lib/firebase/client";
import { getCurrentYear } from "@/lib/utils/dates";
import type { DogLog, LogInput, UserProfile, YearlyTotal } from "@/types/models";

function usersCollection() {
  return collection(db, "users");
}

function logsCollection() {
  return collection(db, "dog_logs");
}

function yearlyTotalsCollection() {
  return collection(db, "yearly_totals");
}

export function yearlyDocId(year: number, userId: string): string {
  return `${year}_${userId}`;
}

function getFallbackName(user: User): string {
  return user.displayName || user.email?.split("@")[0] || "Top Dog";
}

export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const profileRef = doc(usersCollection(), user.uid);
  const currentYear = getCurrentYear();

  const existing = await getDoc(profileRef);
  if (!existing.exists()) {
    const newProfile = {
      uid: user.uid,
      displayName: getFallbackName(user),
      email: user.email || "",
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      currentYearTotal: 0,
      currentYear,
    };

    await setDoc(profileRef, newProfile, { merge: true });
    const created = await getDoc(profileRef);
    return created.data() as UserProfile;
  }

  await updateDoc(profileRef, {
    email: user.email || "",
    photoURL: user.photoURL ?? null,
    lastActiveAt: serverTimestamp(),
  });

  return (await getDoc(profileRef)).data() as UserProfile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(usersCollection(), uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  payload: Pick<UserProfile, "displayName">,
): Promise<void> {
  await updateDoc(doc(usersCollection(), uid), {
    displayName: payload.displayName,
    lastActiveAt: serverTimestamp(),
  });
}

export async function getRecentLogs(uid: string, year: number, maxItems = 15): Promise<DogLog[]> {
  const q = query(
    logsCollection(),
    where("userId", "==", uid),
    where("year", "==", year),
    orderBy("loggedAt", "desc"),
    limit(maxItems),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<DogLog, "id">) }));
}

export async function getLogsForYear(uid: string, year: number): Promise<DogLog[]> {
  const q = query(
    logsCollection(),
    where("userId", "==", uid),
    where("year", "==", year),
    orderBy("loggedAt", "asc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<DogLog, "id">) }));
}

export async function getLeaderboardForYear(year: number, maxItems = 50): Promise<YearlyTotal[]> {
  const q = query(
    yearlyTotalsCollection(),
    where("year", "==", year),
    orderBy("total", "desc"),
    orderBy("mostRecentLoggedAt", "desc"),
    orderBy("displayName", "asc"),
    limit(maxItems),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<YearlyTotal, "id">) }));
}

export type TransactionLogPayload = {
  userId: string;
  displayName: string;
  logId: string;
  imageUrl: string;
  imagePath: string;
  input: LogInput;
};

export async function createLogAndUpdateTotals(payload: TransactionLogPayload): Promise<void> {
  const year = payload.input.loggedAt.getFullYear();
  const currentYear = getCurrentYear();

  await runTransaction(db, async (transaction) => {
    await writeLogAndTotals(transaction, payload, year, currentYear);
  });
}

async function writeLogAndTotals(
  transaction: Transaction,
  payload: TransactionLogPayload,
  logYear: number,
  currentYear: number,
): Promise<void> {
  const now = serverTimestamp();
  const logRef = doc(logsCollection(), payload.logId);
  const userRef = doc(usersCollection(), payload.userId);
  const yearlyRef = doc(yearlyTotalsCollection(), yearlyDocId(logYear, payload.userId));

  const [userSnapshot, yearlySnapshot] = await Promise.all([
    transaction.get(userRef),
    transaction.get(yearlyRef),
  ]);

  const existingYearly = yearlySnapshot.exists()
    ? (yearlySnapshot.data() as Omit<YearlyTotal, "id">)
    : null;

  const nextYearTotal = (existingYearly?.total ?? 0) + payload.input.quantity;
  const logTimestamp = Timestamp.fromDate(payload.input.loggedAt);

  transaction.set(logRef, {
    userId: payload.userId,
    displayName: payload.displayName,
    quantity: payload.input.quantity,
    imageUrl: payload.imageUrl,
    imagePath: payload.imagePath,
    note: payload.input.note || null,
    loggedAt: logTimestamp,
    year: logYear,
    createdAt: now,
  });

  transaction.set(
    yearlyRef,
    {
      year: logYear,
      userId: payload.userId,
      displayName: payload.displayName,
      total: nextYearTotal,
      mostRecentLoggedAt: logTimestamp,
      updatedAt: now,
    },
    { merge: true },
  );

  const userCurrentTotal =
    logYear === currentYear
      ? nextYearTotal
      : (userSnapshot.exists() ? (userSnapshot.data().currentYearTotal as number) : 0);

  transaction.set(
    userRef,
    {
      uid: payload.userId,
      displayName: payload.displayName,
      currentYear: currentYear,
      currentYearTotal: userCurrentTotal,
      lastActiveAt: now,
    },
    { merge: true },
  );
}


