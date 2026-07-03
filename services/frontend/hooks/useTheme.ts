"use client";

import { useTheme as useNextTheme } from "next-themes";
import { DARK, LIGHT, type Theme } from "@/lib/themes";

/**
 * useTheme — returns the current resolved theme object (DARK | LIGHT)
 * plus helpers to toggle and check mode.
 *
 * Usage:
 *   const { t, isDark, toggle } = useTheme();
 */
export function useTheme(): { t: Theme; isDark: boolean; toggle: () => void } {
  const { theme, setTheme } = useNextTheme();
  const isDark = theme !== "light";
  const t: Theme = isDark ? DARK : LIGHT;
  const toggle = () => setTheme(isDark ? "light" : "dark");
  return { t, isDark, toggle };
}