"use client";

import React from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  initialRole?: "student" | "admin";
  role?: "student" | "admin";
  userName?: string;
}

export function AppShell({
  children,
  initialRole,
  role: roleProp,
  userName,
}: AppShellProps) {
  const role = roleProp || initialRole || "student";
  const displayName = userName || (role === "admin" ? "అడ్మిన్" : "రమ్య");

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Header
        currentRole={role}
        userName={displayName}
      />
      <main className={`flex-1 ${role === "admin" ? "pb-8" : "pb-20 md:pb-8"}`}>
        {children}
      </main>
      {role !== "admin" && <BottomNav />}
    </div>
  );
}
