"use client";

import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { DARK, LIGHT, type Theme } from "@/lib/themes";


export function useTheme(): { t: Theme; isDark: boolean; toggle: () => void; mounted: boolean } {
  const { theme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before the client has resolved the stored preference, fall back to the
  // same default the server rendered (dark) so nothing flips mid-render.
  const isDark = !mounted || theme !== "light";
  const t: Theme = isDark ? DARK : LIGHT;
  const toggle = () => setTheme(isDark ? "light" : "dark");
  return { t, isDark, toggle, mounted };
}
