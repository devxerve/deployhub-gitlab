"use client";

import { useTheme as useNextTheme } from "next-themes";
import { DARK, LIGHT, type Theme } from "@/lib/themes";


export function useTheme(): { t: Theme; isDark: boolean; toggle: () => void } {
  const { theme, setTheme } = useNextTheme();
  const isDark = theme !== "light";
  const t: Theme = isDark ? DARK : LIGHT;
  const toggle = () => setTheme(isDark ? "light" : "dark");
  return { t, isDark, toggle };
}