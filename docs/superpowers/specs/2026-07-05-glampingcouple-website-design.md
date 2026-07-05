# glampingcouple.com — Website Design Spec

**Date:** 2026-07-05
**Status:** Approved by user (brainstorming session)

## Overview

A bilingual (Czech default, English) presentation website for a couple who visits and
reviews glamping sites. Two audiences:

1. **The public** — travelers reading honest glamping reviews.
2. **Glamping owners** — the site pitches the couple's review visits: owners invite
   them to stay, review, and point out what works and what "isn't thought through"
   (není domyšlené) so they can improve.

Built with Next.js, fully statically generated, content in markdown files in the repo.

## Goals

- Publish existing reviews from several past stays (own photos, mixed quality — use
  selectively, let design carry atmosphere).
- Make it easy for owners to invite the couple (contact form + visible email).
- Look professional enough that owners take the couple seriously, while keeping a
  warm personal voice.
- CZ + EN from day one; international expansion possible later.

## Pages & URLs

| Page | Czech URL | English URL |
|---|---|---|
| Homepage | `/` | `/en` |
| Reviews list | `/recenze` | `/en/reviews` |
| Review detail | `/recenze/[slug]` | `/en/reviews/[slug]` |
| About us | `/o-nas` | `/en/about` |
| For owners (pitch + contact) | `/pro-majitele` | `/en/for-owners` |
| 404 | localized | localized |

**URL rules:**

- Localized route segments (Czech paths for CZ, English for EN) — better local SEO.
- Review slugs are **identical across languages**, derived from the glamping name,
  ASCII only (no diacritics): `treehouse-pod-jestedem`.
- Every page emits `hreflang` tags pairing its CZ/EN versions.
- Header has a language switcher (same slug, different prefix).

**Homepage content:** hero (tagline + photo), latest 3 reviews, "Na co se
díváme" grid of the six scored focus areas (icon + label), "how we review"
strip explaining the hybrid format, prominent "Pro majitele" CTA.

**Review detail layout:** scorecard (six areas, 1–10 each) → personal intro
story → photo gallery → "Co nás nadchlo" ✓ box → "Co není domyšlené" ✗ box →
verdict box with overall score → footer CTA ("Máte glamping? Pozvěte nás").

**Pro majitele page:** what an invited review includes, what owners get, contact
form + visible email address.

## Review Format (Hybrid + Scorecard)

Each review combines, in this order:

1. **Scorecard first** — six fixed focus areas, each scored 1–10, rendered
   right under the title (before the story): komfort spaní (sleeping),
   hygiena a koupelna (hygiene), čistota (cleanliness), soukromí (privacy),
   výlety v okolí (surroundings), zásobování — dovoz Rohlíku, obchod poblíž
   (supplies).
2. **Personal intro narrative** — the couple's story of the stay.
3. **Structured liked / not-thought-through breakdown.**
4. **One overall verdict** — score 1–10 (the couple's gut call, not a computed
   average) + one-sentence verdict.

The homepage additionally presents the six areas in a "Na co se díváme"
section (icon + label). Consistency of the structured parts is a selling point
toward owners. Explicitly not scored: breakfast/food (often not offered —
covered by supplies) and kids/dog friendliness (a fact, expressed via tags).

## Content Model

One folder per glamping; both language versions and shared photos live together:

```
content/reviews/treehouse-pod-jestedem/
├── cs.md          # Czech review
├── en.md          # English review
└── photos/
    ├── cover.jpg
    └── 01.jpg ...
```

Frontmatter schema (validated with Zod at build time):

```yaml
title: string          # glamping name
location: string       # e.g. "Liberecký kraj"
stayDate: date
score: number          # 1–10 overall
verdict: string        # one-sentence summary
ratings:               # six fixed areas, each 1–10
  sleeping: number     # komfort spaní
  hygiene: number      # hygiena a koupelna
  cleanliness: number  # čistota
  privacy: number      # soukromí
  surroundings: number # výlety v okolí
  supplies: number     # zásobování (Rohlík, obchod poblíž)
liked: string[]        # "Co nás nadchlo" items
notThoughtThrough: string[]  # "Co není domyšlené" items
tags: string[]
published: boolean
```

Markdown body = the personal intro story. Gallery auto-generated from `photos/`
(cover.jpg is the card/OG image).

**Static pages** (O nás, Pro majitele): one markdown file per language.
**UI strings** (nav, buttons, labels): `cs.json` / `en.json` dictionaries.

**Authoring workflow:** the couple provides Czech notes + photos → create folder,
write `cs.md`, translate to `en.md`.

## Visual Design

Chosen direction: **"Útulná příroda" (Cozy nature)** — warm earthy tones (forest
green, cream, terracotta), serif display font (Lora, self-hosted via
`next/font` — full Czech diacritics support), personal/warm tone; feels like a couple's travel diary. Design
elements carry atmosphere where photos can't (mixed photo quality).

## Tech Stack

- **Next.js** (App Router, TypeScript), fully static generation. Verify latest
  stable versions online at implementation-plan time.
- **Bun** as package manager, runtime (`bun --bun next dev`), and test runner
  (`bun test`).
- **Biome** for linting + formatting (replaces ESLint + Prettier), with the
  `react` and `next` rule domains enabled.
- **Tailwind CSS**, custom earthy palette.
- **Content:** `gray-matter` + `remark` for markdown; `next/image` for photos.
- **i18n:** lightweight custom setup (2 locales, no i18n library). Czech at root,
  English under `/en`.
- **Contact form:** Formspree free tier (50 submissions/month) + visible email
  fallback. (Resend was considered and rejected — keep Formspree.)
- **Hosting:** Vercel free tier. Primary domain `glampingcouple.com`;
  `glampingcouple.cz` redirects to it.
- **SEO:** per-page metadata, Open Graph images, `sitemap.xml`, schema.org
  `Review` structured data on review pages.

## Error Handling

- **Build-time frontmatter validation (Zod):** invalid/missing fields fail the
  build with a clear message — broken content never ships.
- **Missing `en.md`:** build warns and skips that review in the EN listing
  (publish Czech first, translate later). Never fails the build.
- **Drafts:** `published: false` excludes a review everywhere.
- **No photos yet:** graceful design placeholder instead of a broken gallery.
- **Contact form:** inline success/error states; visible email as fallback.
- Localized 404 pages.

## Testing

- **`bun test`** unit tests for the content layer: frontmatter parsing +
  validation, slug generation, locale filtering/fallback.
- A test asserting every content file on disk builds into a page.
- Visual appearance verified by eye in preview (design-driven site).

## Out of Scope (for now)

- CMS / web-based authoring (markdown + Claude Code workflow instead).
- Additional languages beyond CZ/EN.
- Comments, user accounts, ratings by visitors.
- Blog separate from reviews.
