# Project screenshots

Drop project screenshots here, one per project, named after the project `slug`:

```
/public/images/projects/<slug>.webp
```

- **Recommended size:** 1200×675 px (16:9). WebP for the smallest file size.
- Reference it from `src/content/projects.ts` via the `image` field, e.g.
  `image: "/images/projects/my-project.webp"`.
- If you omit `image`, the card shows a generated gradient cover (no broken image),
  so you can ship before you have screenshots.
