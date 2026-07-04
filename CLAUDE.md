@AGENTS.md

# Portfolio — working notes for Claude

Bilingual (es/en) Next.js 16 + React 19 + Tailwind v4 portfolio for Hugo Gómez
(CS + Mathematics, Universidad de Oviedo). Content is real, not placeholders —
this file documents how the site is actually organized so edits can be made
straight away without re-deriving structure each session.

Stack quick facts: TypeScript strict, `next-intl` for i18n, `next-themes` for
dark mode, Tailwind v4 CSS-first `@theme`, Formspree contact form, deployed on
Vercel (auto-deploy on push to `main`). Package manager is **pnpm**
(`pnpm dev`, `pnpm build`, `pnpm lint`) — there is no `package-lock.json`.

## Adding or editing a project (the most common task)

Everything lives in **`src/content/projects.ts`**, a single typed array. Each
entry is a case study with these fields (see the `Project` interface at the
top of the file for the authoritative list):

- `slug` — URL id → `/projects/<slug>`.
- `title`, `summary`, `description` — `{ es, en }`. `description` is the long
  case-study paragraph.
- `problem` / `solution` — optional two-part narrative rendered as separate
  sections on the detail page ("El problema" / "La solución"). Existing
  entries are written in first person, past tense, technical but readable
  ("Entrené una CNN...", "Diseñé una arquitectura de dos niveles..."). Match
  that voice for new projects.
- `tech` — array of strings, shown as badges (card shows only the first 4).
- `repoUrl` — GitHub link. Omit or comment out if there's no public repo yet.
- `privateRepo: true` — replaces the GitHub link with a lock badge/icon
  instead (use when the code isn't public, not when the repo just doesn't
  exist yet).
- `demoUrl` — adds a "Live demo" button on the detail page and an external
  icon link on the card.
- `image` — single cover image, ignored if `media` is set.
- `media` — ordered array for the carousel, mixing
  `{ type: "image", src }`, `{ type: "video", src, poster? }`, and
  `{ type: "youtube", id }`. Convention used so far: cover image first, then
  a demo video, then any extra diagram images (see `mcmt` for a 3-item
  example). Put files in `public/images/projects/` — a `.png` cover plus a
  `<name>-demo.mp4` or `demo-<name>.mp4` clip is the established pattern.
  Images render with `object-contain` (not `cover`), so screenshots don't get
  cropped — no strict aspect ratio requirement, just avoid huge file sizes.
- `award` — `{ label: {es,en}, event?: {es,en} }`, renders a trophy badge on
  the card and header of the detail page. Only add for real wins/finalist
  results.
- `featured: true` — shows the project on the home page.
- `date` — ISO `YYYY-MM-DD`. Projects are sorted **descending by date**
  everywhere (`getAllProjects()`), so this controls display order, not just
  metadata. For projects still in progress, use the date you actually
  started/last touched it, not a placeholder.

There is no `status`/"in progress" field or badge anywhere in the code —
don't invent one; if the user asks to convey that a project is ongoing, that
lives only in the prose (`description`/`problem`/`solution`), not a tag.

To add a project: append a new object to the `projects` array in
`src/content/projects.ts`, drop its media in `public/images/projects/`, and
that's it — the list page, home page (if `featured`), sitemap and detail page
are all generated from this one file.

## Other content locations

| What | File |
| --- | --- |
| Name, email, socials, CV paths, Formspree id | `src/lib/config.ts` |
| Skills (grouped by category) | `src/data/skills.ts` |
| Education / experience timeline | `src/data/experience.ts` |
| CV PDFs | `public/cv/CV_Hugo_Gomez_Garcia_{ESP,EN}.pdf` |
| UI strings (buttons, section titles, etc.) | `src/messages/es.json` / `en.json` |

## i18n conventions

- Every piece of user-facing content data uses the `LocalizedText = { es, en }`
  shape (defined in `src/content/projects.ts`, reused by `experience.ts`).
  Fixed UI strings (buttons, nav, empty states) go in
  `src/messages/{es,en}.json` instead, under matching namespaces — **always
  add/update the same key in both files**, never just one.
- Spanish is the default locale, served unprefixed (`/`, `/projects`);
  English is prefixed (`/en`, `/en/projects`) — see `src/i18n/routing.ts`
  (`localePrefix: "as-needed"`).
- `pick(localizedField, locale)` from `src/lib/utils.ts` is the helper used
  everywhere to select the right string.

## Routes / nav

Visible nav (`src/components/layout/Header.tsx`): Home, Projects, About,
Contact. `/math` exists (KaTeX + interactive gradient-descent/Fourier/Lorenz/
neural-net SVG demos) but is **intentionally not in the nav** — it's a
direct-link "lab" page, not primary navigation. Don't add it to `navItems`
unless explicitly asked.

## Deployment

Push to `main` → Vercel auto-deploys to production; PRs get preview URLs.
Relevant env vars (`.env.local` + Vercel dashboard): `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_FORM`. See `DEPLOY.md` for the full one-time setup checklist and
`CONTENT_GUIDE.md` for a more verbose (and occasionally stale, e.g. it still
describes some fields as unfilled placeholders) human-facing walkthrough —
this file is the up-to-date quick reference.
