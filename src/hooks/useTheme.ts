"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "php2shell-theme";

function getStoredOrSystemTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // ignore storage access errors (private browsing, etc.)
  }
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return null; // no stored/system preference away from the "dark" default
}

export function useTheme() {
  // Always "dark" on both the server render and the client's first render —
  // matching layout.tsx's hardcoded className="dark" — so hydration never
  // mismatches. Any stored or system preference is applied right after
  // mount instead, in an effect (a one-frame correction, not a render-time
  // difference), the same pattern used elsewhere in this app for restoring
  // client-only state post-hydration.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const preferred = getStoredOrSystemTheme();
    if (preferred && preferred !== "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time correction from stored/system preference after hydration, not a derived-state sync
      setThemeState(preferred);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
