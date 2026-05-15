"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "yarukoto-theme";
const THEME_CHANGE_EVENT = "yarukoto-theme-change";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function getCurrentTheme(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }

  const theme = document.documentElement.dataset.theme;

  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getCurrentTheme,
    getServerSnapshot,
  );

  function handleThemeChange(nextTheme: Theme) {
    applyTheme(nextTheme);
  }

  return (
    <div
      aria-label="表示テーマ"
      className="grid grid-cols-2 rounded-md border border-slate-300 bg-white p-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      role="group"
    >
      <button
        aria-pressed={theme === "light"}
        className={`inline-flex min-h-9 items-center justify-center gap-1 rounded px-2 transition ${
          theme === "light"
            ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
            : "hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        onClick={() => handleThemeChange("light")}
        type="button"
      >
        <Sun aria-hidden="true" size={14} />
        ライト
      </button>
      <button
        aria-pressed={theme === "dark"}
        className={`inline-flex min-h-9 items-center justify-center gap-1 rounded px-2 transition ${
          theme === "dark"
            ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
            : "hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        onClick={() => handleThemeChange("dark")}
        type="button"
      >
        <Moon aria-hidden="true" size={14} />
        ダーク
      </button>
    </div>
  );
}
