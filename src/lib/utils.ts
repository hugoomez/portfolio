import type { LocalizedText } from "@/content/projects";

type ClassValue = string | number | null | false | undefined;

/** Tiny className joiner (keeps us dependency-free). */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Pick the right language from a bilingual field, defaulting to Spanish. */
export function pick(text: LocalizedText, locale: string): string {
  return locale === "en" ? text.en : text.es;
}

/** Deterministic hue (0–360) derived from a string — used for cover gradients. */
export function hueFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}
