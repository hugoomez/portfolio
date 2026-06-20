# Content Guide — fill the portfolio with your real data

This portfolio ships with **placeholders**. Everything you need to personalise it
lives in a handful of files. Work through this checklist, then redeploy.

> Tip: search the codebase for `TODO (USER)` to jump to every spot that needs you.

---

## 1. Your identity — `src/lib/config.ts`

Edit this single file with your real data:

| Field | What to put |
| --- | --- |
| `name` | Your full name (shows in titles, hero, JSON-LD, OG image, favicon) |
| `shortName` | Short name for the header logo |
| `email` | Your professional contact email |
| `social.github` | Your GitHub profile URL |
| `social.linkedin` | Your LinkedIn profile URL |
| `university` | Education (already set to Universidad de Oviedo — EPI Gijón) |

The production URL and Formspree id come from environment variables (see §6).

---

## 2. Projects — `src/content/projects.ts` (the core)

Replace the three placeholder entries with **3–5 real projects**. Each is a
bilingual, fully-typed case study:

- `slug` — URL id, e.g. `weather-dashboard` → `/projects/weather-dashboard`
- `title`, `summary`, `description` — `{ es, en }` text
- `problem`, `solution` — the case-study narrative (problem → how you solved it)
- `tech` — array of technologies
- `repoUrl`, `demoUrl` — link your GitHub repo and a live demo (recruiters love demos)
- `image` — optional screenshot at `/images/projects/<slug>.webp` (omit for a gradient)
- `featured` — `true` shows it on the home page
- `date` — ISO date, used for ordering

**Quality over quantity.** Don't invent projects — use your real repositories.

---

## 3. Screenshots — `public/images/projects/`

1200×675 px WebP, named `<slug>.webp`. See the README in that folder.

---

## 4. Skills & experience

- `src/data/skills.ts` — adjust the **Proficient / Familiar / Learning** tiers.
  No percentage bars by design (recruiters dislike them).
- `src/data/experience.ts` — your education, internships (prácticas) and roles.

---

## 5. CV (PDF)

Replace the placeholders in `public/cv/`:

- `cv-es.pdf` — Spanish convention: 1 page, with photo.
- `cv-en.pdf` — International: no photo, no date of birth.

The site links the right one per locale automatically.

---

## 6. Environment variables

Copy `.env.example` → `.env.local` and fill in:

- `NEXT_PUBLIC_SITE_URL` — your final URL (e.g. `https://yourname.vercel.app`).
- `NEXT_PUBLIC_FORM` — your [Formspree](https://formspree.io) form id. While empty,
  the contact form falls back to a `mailto:` link, so the site still works.

Add the same variables in **Vercel → Settings → Environment Variables**.

---

## 7. Translations (UI strings)

UI labels live in `src/messages/es.json` and `src/messages/en.json`. The hero
tagline/intro are there too — tweak the wording to sound like you. Keep both files
in sync (same keys).

---

## 8. OPTIONAL — the `/math` showcase

The `/math` route is modular: it renders KaTeX notation plus two interactive,
dependency-light SVG visualisations (gradient descent + Fourier series). It's a
strong differentiator for a CS + Maths profile.

- **To customise:** edit `src/components/features/GradientDescentDemo.tsx` and
  `FourierDemo.tsx`, or add your own demos. For heavier interactive plots you can
  add Plotly (`react-plotly.js`) — load it with `next/dynamic` `{ ssr: false }` and
  only on this route (it's a ~2 MB bundle).
- **To remove entirely:** delete `src/app/[locale]/math/` and the `math` entry in
  the `navItems` array in `src/components/layout/Header.tsx` (and the `/math` line
  in `src/app/sitemap.ts`).

---

## 9. After you deploy

- Submit your sitemap to **Google Search Console** (`/sitemap.xml`).
- Check the OG card on LinkedIn/X/WhatsApp.
- Run Lighthouse (aim ≥95 on all categories) on mobile + desktop.
- Polish your **GitHub profile README** and pin your 6 best repos (see README.md).
