import { endOfYear, format, startOfYear } from "date-fns";

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function yearDateRange(year: number): { start: Date; end: Date } {
  const anchor = new Date(year, 0, 1);
  return { start: startOfYear(anchor), end: endOfYear(anchor) };
}

export function formatShortDate(date: Date): string {
  return format(date, "MMM d");
}

export function formatReadableDateTime(date: Date): string {
  return format(date, "MMM d, yyyy p");
}

