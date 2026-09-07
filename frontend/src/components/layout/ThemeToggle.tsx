"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const CYCLE: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];

const ICON = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

const LABEL = { light: "Light", dark: "Dark", system: "System" } as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
  const Icon = ICON[theme];

  return (
    <button
      onClick={() => setTheme(next)}
      title={`Theme: ${LABEL[theme]} — click to switch to ${LABEL[next]}`}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full transition-colors text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)]"
    >
      <Icon size={14} />
      <span>{LABEL[theme]}</span>
    </button>
  );
}
