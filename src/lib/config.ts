/**
 * Central site configuration.
 *
 * TODO (USER): Edit the values in this file with your real data. Everything the
 * site needs to brand itself (name, tagline, social links, CV paths) lives here.
 * See CONTENT_GUIDE.md for the full checklist.
 */

export const siteConfig = {
  // Canonical production URL. On Vercel set NEXT_PUBLIC_SITE_URL to your
  // *.vercel.app URL (or custom domain) in the project's Environment Variables.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://portfolio.vercel.app",

  // TODO (USER): your full name — feeds page titles, JSON-LD and the OG image.
  name: "Nombre Apellido",

  // Short professional handle used in the header / footer.
  shortName: "Nombre Apellido",

  // University / education context used in JSON-LD structured data.
  university: "Universidad de Oviedo — EPI Gijón",

  // TODO (USER): your professional contact email.
  email: "tu.email@example.com",

  // Public-facing social / professional profiles. Empty string = hidden.
  social: {
    github: "https://github.com/tu-usuario", // TODO (USER)
    linkedin: "https://www.linkedin.com/in/tu-usuario", // TODO (USER)
  },

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
