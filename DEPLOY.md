# Deploy & launch checklist

The site is fully built and passes `pnpm build` + `pnpm lint`. These are the
remaining steps — they need **your** GitHub and Vercel accounts, so they can't be
fully automated.

## 1. Push to GitHub

Create a clean public repo (suggested name: `portfolio`), then:

```bash
git remote add origin https://github.com/<your-username>/portfolio.git
git branch -M main          # optional: rename master → main
git push -u origin main
```

> The CLI can't authenticate to GitHub for you. If `gh` is installed and logged in
> you can instead run `gh repo create portfolio --public --source . --push`.

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in **with GitHub**.
2. **Add New → Project → Import** your `portfolio` repo.
3. Framework preset auto-detects **Next.js** — leave Build Command (`next build`)
   and Output Directory as defaults.
4. **Environment Variables** (Settings → Environment Variables, scope Production +
   Preview):
   - `NEXT_PUBLIC_SITE_URL` = your `https://<project>.vercel.app` URL
   - `NEXT_PUBLIC_FORM` = your Formspree form id (optional; empty = mailto fallback)
5. **Deploy.** You get `https://<project>.vercel.app` with automatic HTTPS.

After the first deploy, copy the real URL into `NEXT_PUBLIC_SITE_URL` and redeploy
so OG images, canonicals and the sitemap point to the right host.

CI/CD is then automatic: push to `main` → production; PRs/branches → preview URLs.

## 3. Fill in your real content

Work through **CONTENT_GUIDE.md** (projects, CV, skills, identity). Don't ship the
placeholders.

## 4. SEO & sharing

- Submit `https://<your-site>/sitemap.xml` to **Google Search Console**.
- Check the OG card renders on LinkedIn / X / WhatsApp.
- Run **Lighthouse** (mobile + desktop), aim ≥95 on all four categories.
- Polish your **GitHub profile README** (see `GITHUB_PROFILE_README.md`) and pin
  your 6 best repositories.

## 5. Optional: custom domain (~10 €/yr)

Buy a domain (e.g. a `.dev`), add it in Vercel → Settings → Domains, set the DNS
records at your registrar, then update `NEXT_PUBLIC_SITE_URL` to the custom domain
and redeploy.
