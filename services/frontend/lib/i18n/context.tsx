"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations, type Language } from "./translations";

const STORAGE_KEY = "deployhub-language";
const DEFAULT_LANGUAGE: Language = "en";

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslateFn;
}

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "es" || value === "fr";
}

function translate(language: Language, key: string, vars?: Record<string, string | number>): string {
  const dict = translations[language] ?? translations[DEFAULT_LANGUAGE];
  let value = dict[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;

  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.split(`{${name}}`).join(String(replacement));
    }
  }

  return value;
}

const defaultContextValue: LanguageContextValue = {
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key, vars) => translate(DEFAULT_LANGUAGE, key, vars),
};

const LanguageContext = createContext<LanguageContextValue>(defaultContextValue);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLanguage(stored)) {
        setLanguageState(stored);
      }
    } catch {
      // localStorage unavailable — keep default language.
    }
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore write failures (e.g. private browsing).
    }
  }, []);

  const t = useCallback<TranslateFn>(
    (key, vars) => translate(language, key, vars),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

export function useTranslation(): { t: TranslateFn } {
  const { t } = useLanguage();
  return { t };
}

export type { Language };
