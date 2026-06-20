import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Spanish first: the primary market is Spain (see plan, Phase 6).
  locales: ["es", "en"],
  defaultLocale: "es",
  // Keep clean URLs for the default locale (no /es prefix), prefix /en.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
