"use server";

import { clearSession } from "./session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
