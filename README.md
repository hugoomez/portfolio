# Portfolio

Bilingual (🇪🇸 / 🇬🇧) developer portfolio for a Computer Science + Mathematics
double-degree student. Built to be edited in minutes and deployed free on Vercel.

**Live:** _set your URL here after deploying_ → `https://<your-project>.vercel.app`

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme`, dark mode via `next-themes`)
- **next-intl** — full i18n (Spanish default, English at `/en`)
- **Vercel Analytics** + **Speed Insights**
- **Formspree** contact form (with a `mailto:` fallback)
- **KaTeX** + hand-built interactive SVG visualisations on the optional `/math` route

## Features

- 🌗 Light / dark / system theme, no flash of wrong theme
- 🌍 Bilingual content model (`{ es, en }`) + localized UI strings
- 📁 Project case studies driven by a single typed file (`src/content/projects.ts`)
- 🔎 SEO: per-page metadata, `sitemap.xml` with hreflang, `robots.txt`,
  build-time OG image, JSON-LD `Person` structured data
- ♿ Accessibility: semantic HTML, visible focus, skip link, reduced-motion support
- 🧮 Optional, modular maths showcase (gradient descent + Fourier series demos)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

Build & run production locally:

```bash
pnpm build
pnpm start
```

## Make it yours

All the content lives in a handful of files — see **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)**.
Quick map:

| What | Where |
| --- | --- |
| Name, email, socials, CV paths | `src/lib/config.ts` |
| Projects (case studies) | `src/content/projects.ts` |
| Skills | `src/data/skills.ts` |
| Education / experience | `src/data/experience.ts` |
| UI strings (es/en) | `src/messages/*.json` |
| Screenshots | `public/images/projects/` |
| CVs (PDF) | `public/cv/` |

Search the codebase for `TODO (USER)` to find every spot that needs your input.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (metadata, OG, sitemap). Set to your `*.vercel.app` URL. |
| `NEXT_PUBLIC_FORM` | Formspree form id. Empty → contact form falls back to `mailto:`. |

## Deploy (Vercel)

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com): **Add New → Project → Import** the repo
   (framework auto-detects Next.js).
3. Add the environment variables above (Production + Preview).
4. Deploy → you get `https://<project>.vercel.app` with automatic HTTPS and
   Git-based CI/CD (push to `master` ships to production; PRs get preview URLs).

See [DEPLOY.md](./DEPLOY.md) for the full step-by-step.
