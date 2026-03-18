"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { toggle, resolvedTheme, mounted } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={[
        "inline-flex items-center justify-center",
        "h-10 w-10 rounded-full",
        "border border-[var(--border)]",
        "bg-white/70 dark:bg-zinc-900/60 backdrop-blur",
        "text-zinc-700 dark:text-zinc-200",
        "hover:bg-white dark:hover:bg-zinc-900",
        "shadow-sm hover:shadow-md",
        "transition",
        className,
      ].join(" ")}
      aria-label={
        mounted ? (isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối") : "Đổi giao diện"
      }
      title={mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
    >
      {mounted ? (
        isDark ? (
          <FiSun className="text-[18px]" />
        ) : (
          <FiMoon className="text-[18px]" />
        )
      ) : (
        <span className="h-[18px] w-[18px] rounded-full bg-zinc-300/70 dark:bg-zinc-700/70" />
      )}
    </button>
  );
}

