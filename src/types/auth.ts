export type UserRole = "student" | "admin";

export interface StudentPreferences {
  displayName: string;
  language: "te" | "en";
  educationBackground?: string;
  statisticsFamiliarity: "beginner" | "intermediate" | "comfortable";
  dailyStudyMinutes: number; // e.g. 120 (2 hours)
  preferredStudyWindow: "morning" | "afternoon" | "evening" | "flexible";
  targetExam: string;
  enableVoice: boolean;
  textSize: "normal" | "large" | "extra-large";
  hasCompletedOnboarding: boolean;
  hasCompletedDiagnostic: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  studentPreferences?: StudentPreferences;
}

export interface AuthSession {
  user: UserProfile | null;
  token?: string;
}
