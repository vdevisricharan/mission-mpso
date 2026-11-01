import { cookies } from "next/headers";
import { UserProfile } from "@/types/auth";
import { db } from "@/lib/db";

const SESSION_COOKIE_NAME = "mpso_session_user_id";

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!userId) {
      // Return default student profile for frictionless seamless access
      return db.getUser("student_default");
    }
    const user = db.getUser(userId);
    return user || db.getUser("student_default");
  } catch (error) {
    return db.getUser("student_default");
  }
}

export async function setSessionUser(userId: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return true;
  } catch {
    return false;
  }
}

export async function clearSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in");
  }
  return user;
}

export async function requireAdmin(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Forbidden: Administrator access required");
  }
  return user;
}
