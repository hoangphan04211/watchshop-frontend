"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

function applyThemeClass(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system"); // "light" | "dark" | "system"
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark" || saved === "system") setTheme(saved);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.themeAnimate = "true";
    const t = setTimeout(() => {
      delete root.dataset.themeAnimate;
    }, 250);
    return () => clearTimeout(t);
  }, [theme]);

  useEffect(() => {
    if (!mounted) return;
    if (theme === "system") {
      applyThemeClass(getSystemPrefersDark() ? "dark" : "light");
      const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
      if (!mq?.addEventListener) return;
      const onChange = (e) => applyThemeClass(e.matches ? "dark" : "light");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    applyThemeClass(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const value = useMemo(
    () => ({
      theme,
      mounted,
      // Important: keep first client render consistent with server to avoid hydration mismatch.
      resolvedTheme:
        !mounted ? "light" : theme === "system" ? (getSystemPrefersDark() ? "dark" : "light") : theme,
      setTheme,
      toggle: () =>
        setTheme((t) => {
          const resolved =
            t === "system" ? (mounted && getSystemPrefersDark() ? "dark" : "light") : t;
          return resolved === "dark" ? "light" : "dark";
        }),
    }),
    [theme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

