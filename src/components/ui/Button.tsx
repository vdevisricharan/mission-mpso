"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "soft";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#176B5B] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-target select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-[#176B5B] text-white hover:bg-[#13584B] active:bg-[#104E43] shadow-sm",
      secondary:
        "bg-[#17211E] text-white hover:bg-[#25332F] active:bg-[#0E1513]",
      outline:
        "border border-[#E5EAE5] bg-white text-[#17211E] hover:bg-[#F5F6F2] hover:border-[#CBD5CB]",
      ghost:
        "text-[#17211E] hover:bg-[#E8F4F0] hover:text-[#176B5B]",
      danger:
        "bg-[#B33D44] text-white hover:bg-[#962F36] active:bg-[#7D242B]",
      soft:
        "bg-[#E8F4F0] text-[#176B5B] hover:bg-[#D5ECE5] active:bg-[#BFE2D7]",
    };

    const sizeStyles = {
      sm: "text-sm px-3 py-1.5 min-h-[40px]",
      md: "text-base px-4 py-2.5 min-h-[44px]",
      lg: "text-lg px-6 py-3.5 min-h-[50px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>వేచి ఉండండి...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
