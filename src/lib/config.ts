/**
 * Central site configuration.
 *
 * TODO (USER): Edit the values in this file with your real data. Everything the
 * site needs to brand itself (name, tagline, social links, CV paths) lives here.
 * See CONTENT_GUIDE.md for the full checklist.
 */

const DEFAULT_URL = "https://portfolio.vercel.app";

/**
 * Normalise NEXT_PUBLIC_SITE_URL into a valid absolute URL so a malformed value
 * (e.g. "hugogomez" with no protocol) can never crash the build's `new URL(...)`.
 * Adds https:// if missing and falls back to the default if still invalid.
 */
function resolveSiteUrl(raw: string | undefined): string {
  if (!raw) return DEFAULT_URL;
  let value = raw.trim().replace(/\/+$/, "");
  if (!value) return DEFAULT_URL;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  try {
    return new URL(value).origin;
  } catch {
    return DEFAULT_URL;
  }
}

export const siteConfig = {
  // Canonical production URL. On Vercel set NEXT_PUBLIC_SITE_URL to your full
  // *.vercel.app URL (or custom domain), e.g. https://portfolio-xxx.vercel.app
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),

  // TODO (USER): your full name — feeds page titles, JSON-LD and the OG image.
  name: "Hugo Gómez García",

  // Short professional handle used in the header / footer.
  shortName: "Hugo Gómez",

  // University / education context used in JSON-LD structured data.
  university: "Universidad de Oviedo",

  // TODO (USER): your professional contact email.
  email: "gomezgarciahu@gmail.com",

  // Public-facing social / professional profiles. Empty string = hidden.
  social: {
    github: "https://github.com/hugoomez", // TODO (USER)
    linkedin: "https://www.linkedin.com/in/hugoomez/", // TODO (USER)
  },

  // Your headshot. Drop the file at public/images/avatar.png — set to "" to hide.
  avatar: "",

  // Downloadable CVs. Drop the PDFs in /public/cv/ (see CONTENT_GUIDE.md).
  cv: {
    es: "/cv/cv-es.pdf",
    en: "/cv/cv-en.pdf",
  },

  // Formspree form id (https://formspree.io). Set NEXT_PUBLIC_FORM in .env.local
  // and in Vercel. While empty, the contact form falls back to a mailto: link.
  formspreeId: process.env.NEXT_PUBLIC_FORM ?? "",
} as const;

export type SiteConfig = typeof siteConfig;
