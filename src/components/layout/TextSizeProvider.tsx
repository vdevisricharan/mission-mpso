"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type TextSize = "normal" | "large" | "extra-large";
export type Language = "te" | "en";

interface PreferencesContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export function TextSizeProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>("normal");
  const [language, setLanguageState] = useState<Language>("te");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedSize = localStorage.getItem("mission_mpso_text_size") as TextSize;
      if (savedSize && ["normal", "large", "extra-large"].includes(savedSize)) {
        setTextSizeState(savedSize);
        document.documentElement.setAttribute("data-text-size", savedSize);
      } else {
        document.documentElement.setAttribute("data-text-size", "normal");
      }

      const savedLang = localStorage.getItem("mission_mpso_lang") as Language;
      if (savedLang && ["te", "en"].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    } catch {
      // Ignore localStorage read errors
    }
    setMounted(true);
  }, []);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    document.documentElement.setAttribute("data-text-size", size);
    try {
      localStorage.setItem("mission_mpso_text_size", size);
    } catch {}
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("mission_mpso_lang", lang);
    } catch {}
  };

  const increaseTextSize = () => {
    if (textSize === "normal") setTextSize("large");
    else if (textSize === "large") setTextSize("extra-large");
  };

  const decreaseTextSize = () => {
    if (textSize === "extra-large") setTextSize("large");
    else if (textSize === "large") setTextSize("normal");
  };

  return (
    <PreferencesContext.Provider
      value={{
        textSize,
        setTextSize,
        language,
        setLanguage,
        increaseTextSize,
        decreaseTextSize,
      }}
    >
      <div className={`transition-all duration-150 ${mounted ? "" : "opacity-95"}`}>
        {children}
      </div>
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a TextSizeProvider");
  }
  return context;
}
