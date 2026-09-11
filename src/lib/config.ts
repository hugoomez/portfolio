/** Central site configuration. */

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

  name: "Hugo Gómez García",

  shortName: "Hugo Gómez",

  university: "Universidad de Oviedo",

  email: "gomezgarciahu@gmail.com",

  social: {
    github: "https://github.com/hugoomez",
    linkedin: "https://www.linkedin.com/in/hugoomez/",
  },

  // Your headshot. Drop the file at public/images/avatar.png — set to "" to hide.
  avatar: "",

  // Downloadable CV. Drop the PDF in /public/cv/ (see CONTENT_GUIDE.md).
  cv: "/cv/CV_Hugo_Gomez_Garcia_EN.pdf",

  // Formspree form id (https://formspree.io). Set NEXT_PUBLIC_FORM in .env.local
  // and in Vercel. While empty, the contact form falls back to a mailto: link.
  formspreeId: process.env.NEXT_PUBLIC_FORM ?? "",
} as const;

export type SiteConfig = typeof siteConfig;
