import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "info" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className,
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#E8F4F0] text-[#176B5B] border border-[#BFE2D7]",
    info: "bg-[#EDF4FA] text-[#356EA0] border border-[#C5DCF0]",
    success: "bg-[#EEF9F2] text-[#1B8354] border border-[#BEE7CE]",
    warning: "bg-[#FEF7ED] text-[#A66A19] border border-[#F6DCBA]",
    danger: "bg-[#FDF2F2] text-[#B33D44] border border-[#F7CDD0]",
    neutral: "bg-[#F5F6F2] text-[#65716D] border border-[#E5EAE5]",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 rounded-md",
    md: "text-xs md:text-sm px-2.5 py-1 rounded-lg font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 max-w-full text-left leading-snug break-words",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
