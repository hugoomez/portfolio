"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const t = useTranslations("Theme");
  const { resolvedTheme, setTheme } = useTheme();

  // Before next-themes resolves on the client, resolvedTheme is undefined on
  // both server and client, so the initial icon (Moon) matches — no hydration
  // mismatch, and no setState-in-effect needed.
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={t("toggle")}
      title={t("toggle")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
    >
      <Sun className="hidden h-4 w-4 dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </button>
  );
}
