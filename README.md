# glampingcouple.com

Bilingual (CZ/EN) static glamping-review website. Next.js 16 + Bun + Tailwind v4 + Biome.

## Commands

- `bun run dev` — dev server (syncs photos first)
- `bun run build` — production build
- `bun test` — unit tests
- `bun run lint` / `bun run format` — Biome

## Adding a review

1. Create `content/reviews/<slug>/` (slug = glamping name, ASCII, kebab-case).
2. Write `cs.md` (frontmatter: title, location, stayDate, score 1–10, verdict,
   liked[], notThoughtThrough[], ratings{sleeping, hygiene, cleanliness,
   privacy, surroundings, supplies — each 1–10}, tags[], published) + story
   as the body.
3. Translate to `en.md` (same slug, same frontmatter shape). Missing `en.md`
   just hides the review from the English site.
4. Drop photos into `photos/` — `cover.jpg` is the card/OG image.
5. `bun run build` validates everything; invalid frontmatter fails the build.

Set `published: false` for drafts.

## Environment

Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
