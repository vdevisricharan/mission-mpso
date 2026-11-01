import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatDateTelugu(dateString: string | Date): string {
  const d = new Date(dateString);
  return d.toLocaleDateString("te-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
