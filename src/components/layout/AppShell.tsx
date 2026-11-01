"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  initialRole?: "student" | "admin";
}

export function AppShell({ children, initialRole = "student" }: AppShellProps) {
  const [role, setRole] = useState<"student" | "admin">(initialRole);

  const toggleRole = () => {
    setRole((prev) => (prev === "student" ? "admin" : "student"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Header
        currentRole={role}
        userName={role === "admin" ? "అడ్మిన్" : "రమ్య"}
        onRoleToggle={toggleRole}
      />
      <main className="flex-1 pb-20 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
