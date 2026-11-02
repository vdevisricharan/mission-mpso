"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathProps {
  math: string;
  className?: string;
}

export function MathInline({ math, className = "" }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <span
      className={`inline-block mx-1 font-serif text-[1.05em] align-baseline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MathBlock({ math, className = "" }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <div
      className={`my-3 p-3 bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl overflow-x-auto max-w-full text-center ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
