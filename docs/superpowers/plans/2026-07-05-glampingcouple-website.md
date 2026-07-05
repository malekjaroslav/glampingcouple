# glampingcouple.com Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual (CZ default + EN) static glamping-review website glampingcouple.com per the approved spec at `docs/superpowers/specs/2026-07-05-glampingcouple-website-design.md`.

**Architecture:** Fully statically generated Next.js 16 App Router site. Czech routes at the root (`/recenze`), English mirrors under `/en/reviews`. Content is markdown in `content/` (one folder per glamping with `cs.md` + `en.md` + shared `photos/`), validated with Zod at build time. Thin route files delegate to shared page components parameterized by locale.

**Tech Stack:** Next.js 16.2.x (Turbopack), React 19, TypeScript, Bun (package manager + runtime + `bun test`), Biome 2.x (lint + format), Tailwind CSS v4 (CSS-first `@theme`), gray-matter + remark (markdown), Zod v4, Formspree (contact form), Vercel (hosting).

**Conventions used throughout:**

- All commands run from the repo root `/Users/malekjaroslav/glapingcouple`.
- Import alias `@/*` → `src/*`.
- Design tokens: cream `#faf6ef`, sand `#f1e8d8`, forest `#3d4a3a`, forest-dark `#2e3a2b`, moss `#8a9a5b`, terracotta `#b06b43`. Display font: Lora (self-hosted via `next/font`, subsets `latin` + `latin-ext` for Czech diacritics).
- The repo already contains `docs/`, `.gitignore`, and `.superpowers/` (gitignored). Do not delete them.

---

### Task 1: Project Scaffold (Bun + Next 16 + Tailwind v4 + Biome)

**Files:**
- Create: `package.json` (via bun + edits), `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `biome.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Modify: `.gitignore`

- [ ] **Step 1: Verify Bun is installed**

Run: `bun --version`
Expected: a version number (1.x). If missing, install: `curl -fsSL https://bun.sh/install | bash` and restart the shell.

- [ ] **Step 2: Install dependencies**

```bash
bun init -y 2>/dev/null || true   # only to create package.json if bun needs one; safe if it exists
rm -f index.ts                      # bun init artifact, not needed
bun add next@latest react@latest react-dom@latest gray-matter remark remark-html zod
bun add -d typescript @types/react @types/react-dom @types/node @types/bun @biomejs/biome tailwindcss @tailwindcss/postcss
```

Expected: `package.json` + `bun.lock` created, `node_modules/` populated. Next should resolve to 16.2.x.

- [ ] **Step 3: Set package.json scripts**

Edit `package.json` so the top-level fields include (keep the generated `dependencies`/`devDependencies`):

```json
{
  "name": "glampingcouple",
  "private": true,
  "scripts": {
    "sync-photos": "bun scripts/sync-photos.ts",
    "dev": "bun run sync-photos && bun --bun next dev",
    "build": "bun run sync-photos && bun --bun next build",
    "start": "bun --bun next start",
    "test": "bun test",
    "lint": "biome check .",
    "format": "biome format --write ."
  }
}
```

(The `scripts/sync-photos.ts` file arrives in Task 7 — until then `bun run dev`/`build` will fail on the sync step; that is expected. Use `bun --bun next build` directly for verification in Tasks 1–6.)

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create next.config.ts and postcss.config.mjs**

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

`postcss.config.mjs`:

```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

- [ ] **Step 6: Create biome.json**

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "formatter": { "enabled": true, "indentStyle": "space" },
  "linter": {
    "enabled": true,
    "domains": { "react": "recommended", "next": "recommended" }
  },
  "assist": { "actions": { "source": { "organizeImports": "on" } } }
}
```

- [ ] **Step 7: Create minimal app shell**

`src/app/globals.css` (placeholder — full theme comes in Task 8):

```css
@import "tailwindcss";
```

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "glampingcouple",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx`:

```tsx
export default function Home() {
  return <main className="p-8 font-bold">glampingcouple.com — coming soon</main>;
}
```

- [ ] **Step 8: Update .gitignore**

Append to the existing `.gitignore`:

```
next-env.d.ts
.next/
out/
.vercel
*.tsbuildinfo
public/reviews/
```

- [ ] **Step 9: Verify build and lint**

Run: `bun --bun next build`
Expected: build succeeds, `/` page statically generated.

Run: `bun run lint`
Expected: no errors (fix any Biome complaints in the shell files before committing).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next 16 + Bun + Tailwind v4 + Biome project"
```

---

### Task 2: Site Constants, i18n Route Helpers & Dictionaries

**Files:**
- Create: `src/lib/site.ts`, `src/lib/i18n.ts`, `src/dictionaries/cs.json`, `src/dictionaries/en.json`
- Test: `tests/i18n.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/i18n.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import {
  DEFAULT_LOCALE,
  LOCALES,
  formatStayDate,
  getDictionary,
  otherLocale,
  pagePath,
  reviewPath,
} from "@/lib/i18n";

describe("locales", () => {
  test("cs is the default locale", () => {
    expect(DEFAULT_LOCALE).toBe("cs");
    expect(LOCALES).toEqual(["cs", "en"]);
  });

  test("otherLocale flips", () => {
    expect(otherLocale("cs")).toBe("en");
    expect(otherLocale("en")).toBe("cs");
  });
});

describe("pagePath", () => {
  test("czech routes live at the root with czech segments", () => {
    expect(pagePath("home", "cs")).toBe("/");
    expect(pagePath("reviews", "cs")).toBe("/recenze");
    expect(pagePath("about", "cs")).toBe("/o-nas");
    expect(pagePath("forOwners", "cs")).toBe("/pro-majitele");
  });

  test("english routes live under /en with english segments", () => {
    expect(pagePath("home", "en")).toBe("/en");
    expect(pagePath("reviews", "en")).toBe("/en/reviews");
    expect(pagePath("about", "en")).toBe("/en/about");
    expect(pagePath("forOwners", "en")).toBe("/en/for-owners");
  });
});

describe("reviewPath", () => {
  test("shares the slug across locales", () => {
    expect(reviewPath("cs", "treehouse-pod-jestedem")).toBe("/recenze/treehouse-pod-jestedem");
    expect(reviewPath("en", "treehouse-pod-jestedem")).toBe("/en/reviews/treehouse-pod-jestedem");
  });
});

describe("getDictionary", () => {
  test("returns matching translations with identical shape", () => {
    const cs = getDictionary("cs");
    const en = getDictionary("en");
    expect(cs.nav.reviews).toBe("Recenze");
    expect(en.nav.reviews).toBe("Reviews");
    expect(Object.keys(cs).sort()).toEqual(Object.keys(en).sort());
  });
});

describe("formatStayDate", () => {
  test("formats month + year per locale", () => {
    const d = new Date("2026-05-16");
    expect(formatStayDate(d, "cs")).toBe("květen 2026");
    expect(formatStayDate(d, "en")).toBe("May 2026");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/i18n.test.ts`
Expected: FAIL — cannot resolve `@/lib/i18n`.

- [ ] **Step 3: Create the dictionaries**

`src/dictionaries/cs.json`:

```json
{
  "nav": { "reviews": "Recenze", "about": "O nás", "forOwners": "Pro majitele" },
  "home": {
    "heroTitle": "Spíme pod hvězdami",
    "heroAccent": "a všímáme si detailů.",
    "heroText": "Jsme pár, který objíždí glampingy po Česku i okolí. Píšeme poctivě, co nás nadchlo — i co není domyšlené.",
    "heroCta": "Pozvěte nás",
    "latestTitle": "Nejnovější recenze",
    "allReviews": "Všechny recenze",
    "howTitle": "Jak recenzujeme",
    "howStep1Title": "Příběh pobytu",
    "howStep1Text": "Každou recenzi otevírá osobní vyprávění — jak se u vás doopravdy spí, snídá a odpočívá.",
    "howStep2Title": "Nadchlo × není domyšlené",
    "howStep2Text": "Poctivý seznam toho, co milujeme, a detailů, které by šly vylepšit.",
    "howStep3Title": "Verdikt",
    "howStep3Text": "Jedno celkové hodnocení 1–10 a shrnutí jednou větou.",
    "ownersTitle": "Máte glamping?",
    "ownersText": "Pozvěte nás na pobyt. Napíšeme poctivou recenzi a dáme vám konkrétní tipy, co vylepšit.",
    "ownersCta": "Zjistit víc"
  },
  "reviews": {
    "title": "Recenze glampingů",
    "empty": "Zatím tu nic není — první recenze jsou na cestě.",
    "readMore": "Číst recenzi"
  },
  "review": {
    "liked": "Co nás nadchlo",
    "notThoughtThrough": "Co není domyšlené",
    "verdict": "Náš verdikt",
    "stayDate": "Termín pobytu",
    "backToReviews": "Zpět na recenze",
    "ctaTitle": "Máte glamping? Pozvěte nás.",
    "ctaButton": "Pro majitele"
  },
  "contact": {
    "name": "Vaše jméno",
    "email": "E-mail",
    "glamping": "Název glampingu",
    "website": "Web glampingu (nepovinné)",
    "message": "Zpráva",
    "send": "Odeslat",
    "sending": "Odesílám…",
    "success": "Děkujeme! Ozveme se co nejdřív.",
    "error": "Odeslání se nepovedlo. Napište nám prosím e-mailem.",
    "emailIntro": "Nebo nám rovnou napište:"
  },
  "footer": { "tagline": "Poctivé recenze glampingů — česky i anglicky" },
  "notFound": { "title": "Stránka nenalezena", "back": "Zpět na úvod" }
}
```

`src/dictionaries/en.json`:

```json
{
  "nav": { "reviews": "Reviews", "about": "About us", "forOwners": "For owners" },
  "home": {
    "heroTitle": "We sleep under the stars",
    "heroAccent": "and notice the details.",
    "heroText": "We are a couple touring glampings across Czechia and beyond. We write honestly about what delighted us — and what isn't quite thought through.",
    "heroCta": "Invite us",
    "latestTitle": "Latest reviews",
    "allReviews": "All reviews",
    "howTitle": "How we review",
    "howStep1Title": "The story of the stay",
    "howStep1Text": "Every review opens with a personal story — how sleeping, breakfasting and unwinding at your place really feels.",
    "howStep2Title": "Loved × not thought through",
    "howStep2Text": "An honest list of what we love and the details that could be improved.",
    "howStep3Title": "The verdict",
    "howStep3Text": "One overall score from 1–10 and a one-sentence summary.",
    "ownersTitle": "Do you run a glamping?",
    "ownersText": "Invite us for a stay. We'll write an honest review and give you concrete tips on what to improve.",
    "ownersCta": "Learn more"
  },
  "reviews": {
    "title": "Glamping reviews",
    "empty": "Nothing here yet — the first reviews are on their way.",
    "readMore": "Read the review"
  },
  "review": {
    "liked": "What delighted us",
    "notThoughtThrough": "What isn't thought through",
    "verdict": "Our verdict",
    "stayDate": "Stay date",
    "backToReviews": "Back to reviews",
    "ctaTitle": "Do you run a glamping? Invite us.",
    "ctaButton": "For owners"
  },
  "contact": {
    "name": "Your name",
    "email": "E-mail",
    "glamping": "Glamping name",
    "website": "Glamping website (optional)",
    "message": "Message",
    "send": "Send",
    "sending": "Sending…",
    "success": "Thank you! We'll get back to you soon.",
    "error": "Sending failed. Please e-mail us directly.",
    "emailIntro": "Or write to us directly:"
  },
  "footer": { "tagline": "Honest glamping reviews — in Czech and English" },
  "notFound": { "title": "Page not found", "back": "Back to home" }
}
```

- [ ] **Step 4: Create site constants and i18n helpers**

`src/lib/site.ts`:

```ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://glampingcouple.com";
export const SITE_NAME = "glampingcouple";
// TODO-USER: replace with the real contact address before launch
export const CONTACT_EMAIL = "ahoj@glampingcouple.com";
```

`src/lib/i18n.ts`:

```ts
import cs from "@/dictionaries/cs.json";
import en from "@/dictionaries/en.json";

export const LOCALES = ["cs", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "cs";

export type Dictionary = typeof cs;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "cs" ? cs : (en as Dictionary);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "cs" ? "en" : "cs";
}

export type PageKey = "home" | "reviews" | "about" | "forOwners";

const ROUTES: Record<PageKey, Record<Locale, string>> = {
  home: { cs: "/", en: "/en" },
  reviews: { cs: "/recenze", en: "/en/reviews" },
  about: { cs: "/o-nas", en: "/en/about" },
  forOwners: { cs: "/pro-majitele", en: "/en/for-owners" },
};

export function pagePath(page: PageKey, locale: Locale): string {
  return ROUTES[page][locale];
}

export function reviewPath(locale: Locale, slug: string): string {
  return locale === "cs" ? `/recenze/${slug}` : `/en/reviews/${slug}`;
}

export function formatStayDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale === "cs" ? "cs-CZ" : "en-GB", {
    month: "long",
    year: "numeric",
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test tests/i18n.test.ts`
Expected: PASS (all tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/site.ts src/lib/i18n.ts src/dictionaries tests/i18n.test.ts
git commit -m "feat: i18n route helpers, dictionaries and site constants"
```

---

### Task 3: Review Frontmatter Schema (Zod v4)

**Files:**
- Create: `src/lib/schema.ts`
- Test: `tests/schema.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/schema.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { reviewFrontmatterSchema } from "@/lib/schema";

const valid = {
  title: "Treehouse pod Ještědem",
  location: "Liberecký kraj",
  stayDate: new Date("2026-05-16"),
  score: 8,
  verdict: "Kouzelné místo, které by s pár úpravami bylo dokonalé.",
  liked: ["Výhled na Ještěd"],
  notThoughtThrough: ["Neosvětlená cesta na toaletu"],
  tags: ["treehouse"],
  published: true,
};

describe("reviewFrontmatterSchema", () => {
  test("accepts a valid frontmatter", () => {
    const parsed = reviewFrontmatterSchema.parse(valid);
    expect(parsed.title).toBe(valid.title);
    expect(parsed.stayDate).toBeInstanceOf(Date);
  });

  test("coerces a string stayDate", () => {
    const parsed = reviewFrontmatterSchema.parse({ ...valid, stayDate: "2026-05-16" });
    expect(parsed.stayDate.getFullYear()).toBe(2026);
  });

  test("defaults tags to an empty array", () => {
    const { tags, ...rest } = valid;
    expect(reviewFrontmatterSchema.parse(rest).tags).toEqual([]);
  });

  test("rejects score outside 1-10", () => {
    expect(() => reviewFrontmatterSchema.parse({ ...valid, score: 11 })).toThrow();
    expect(() => reviewFrontmatterSchema.parse({ ...valid, score: 0 })).toThrow();
  });

  test("rejects empty liked list", () => {
    expect(() => reviewFrontmatterSchema.parse({ ...valid, liked: [] })).toThrow();
  });

  test("rejects missing verdict", () => {
    const { verdict, ...rest } = valid;
    expect(() => reviewFrontmatterSchema.parse(rest)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/schema.test.ts`
Expected: FAIL — cannot resolve `@/lib/schema`.

- [ ] **Step 3: Implement the schema**

`src/lib/schema.ts`:

```ts
import { z } from "zod";

export const reviewFrontmatterSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  stayDate: z.coerce.date(),
  score: z.number().int().min(1).max(10),
  verdict: z.string().min(1),
  liked: z.array(z.string().min(1)).min(1),
  notThoughtThrough: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string()).default([]),
  published: z.boolean(),
});

export type ReviewFrontmatter = z.infer<typeof reviewFrontmatterSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/schema.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/schema.ts tests/schema.test.ts
git commit -m "feat: zod schema for review frontmatter"
```

---

### Task 4: Markdown Renderer

**Files:**
- Create: `src/lib/markdown.ts`
- Test: `tests/markdown.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/markdown.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { markdownToHtml } from "@/lib/markdown";

describe("markdownToHtml", () => {
  test("renders headings and paragraphs", async () => {
    const html = await markdownToHtml("# Ahoj\n\nPrvní noc byla **kouzelná**.");
    expect(html).toContain("<h1>Ahoj</h1>");
    expect(html).toContain("<strong>kouzelná</strong>");
  });

  test("returns empty string for empty input", async () => {
    expect(await markdownToHtml("")).toBe("");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/markdown.test.ts`
Expected: FAIL — cannot resolve `@/lib/markdown`.

- [ ] **Step 3: Implement**

`src/lib/markdown.ts`:

```ts
import { remark } from "remark";
import html from "remark-html";

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString().trim();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/markdown.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/markdown.ts tests/markdown.test.ts
git commit -m "feat: markdown to html renderer"
```

---

### Task 5: Review Content Loader

**Files:**
- Create: `src/lib/content.ts`
- Create fixtures: `tests/fixtures/content/reviews/…` (see Step 1), `tests/fixtures/content-invalid/reviews/bad-review/cs.md`
- Test: `tests/content.test.ts`

- [ ] **Step 1: Create test fixtures**

`tests/fixtures/content/reviews/maringotka-u-lesa/cs.md`:

```markdown
---
title: "Maringotka U Lesa"
location: "Jižní Čechy"
stayDate: 2026-06-20
score: 9
verdict: "Nejlepší maringotka, ve které jsme kdy spali."
liked:
  - "Vana pod širým nebem"
  - "Snídaňový košík od místního pekaře"
notThoughtThrough:
  - "Chybí stínění na jižní okno"
tags: ["maringotka"]
published: true
---

První ráno nás vzbudilo slunce nad rybníkem a vůně lesa.
```

`tests/fixtures/content/reviews/maringotka-u-lesa/en.md`:

```markdown
---
title: "Maringotka U Lesa"
location: "South Bohemia"
stayDate: 2026-06-20
score: 9
verdict: "The best shepherd's hut we have ever slept in."
liked:
  - "Open-air bathtub"
  - "Breakfast basket from a local bakery"
notThoughtThrough:
  - "No shading on the south-facing window"
tags: ["maringotka"]
published: true
---

The first morning we woke to sun over the pond and the scent of the forest.
```

`tests/fixtures/content/reviews/maringotka-u-lesa/photos/cover.jpg` and `photos/01.jpg` — create as dummy files:

```bash
mkdir -p tests/fixtures/content/reviews/maringotka-u-lesa/photos
printf 'x' > tests/fixtures/content/reviews/maringotka-u-lesa/photos/cover.jpg
printf 'x' > tests/fixtures/content/reviews/maringotka-u-lesa/photos/01.jpg
```

`tests/fixtures/content/reviews/jurta-na-kopci/cs.md` (Czech only — no `en.md`, no photos):

```markdown
---
title: "Jurta Na Kopci"
location: "Vysočina"
stayDate: 2026-04-11
score: 7
verdict: "Krásný výhled, ale detaily pokulhávají."
liked:
  - "Panoramatický výhled z postele"
notThoughtThrough:
  - "Vrzající dveře"
published: true
---

Jurta stojí na kopci nad vesnicí a vítr si s ní povídá celou noc.
```

`tests/fixtures/content/reviews/tajny-koncept/cs.md` (draft):

```markdown
---
title: "Tajný koncept"
location: "Neznámo kde"
stayDate: 2026-07-01
score: 5
verdict: "Ještě nepublikovat."
liked:
  - "Zatím tajné"
notThoughtThrough:
  - "Zatím tajné"
published: false
---

Rozepsaná recenze.
```

`tests/fixtures/content-invalid/reviews/bad-review/cs.md` (score out of range, missing verdict):

```markdown
---
title: "Rozbitá recenze"
location: "Testov"
stayDate: 2026-01-01
score: 15
liked:
  - "Nic"
notThoughtThrough:
  - "Vše"
published: true
---

Tohle projít nesmí.
```

- [ ] **Step 2: Write the failing test**

`tests/content.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import path from "node:path";
import { getReviewBySlug, getReviews } from "@/lib/content";

const FIXTURES = path.join(import.meta.dir, "fixtures", "content");
const FIXTURES_INVALID = path.join(import.meta.dir, "fixtures", "content-invalid");

describe("getReviews", () => {
  test("returns published czech reviews sorted by stayDate desc", () => {
    const reviews = getReviews("cs", FIXTURES);
    expect(reviews.map((r) => r.slug)).toEqual(["maringotka-u-lesa", "jurta-na-kopci"]);
  });

  test("excludes drafts", () => {
    const slugs = getReviews("cs", FIXTURES).map((r) => r.slug);
    expect(slugs).not.toContain("tajny-koncept");
  });

  test("skips reviews without en.md in the english listing", () => {
    const reviews = getReviews("en", FIXTURES);
    expect(reviews.map((r) => r.slug)).toEqual(["maringotka-u-lesa"]);
  });

  test("maps photos to public urls with cover detection", () => {
    const review = getReviews("cs", FIXTURES)[0];
    expect(review.photos).toEqual([
      "/reviews/maringotka-u-lesa/01.jpg",
      "/reviews/maringotka-u-lesa/cover.jpg",
    ]);
    expect(review.cover).toBe("/reviews/maringotka-u-lesa/cover.jpg");
  });

  test("review without photos has empty photos and null cover", () => {
    const review = getReviews("cs", FIXTURES).find((r) => r.slug === "jurta-na-kopci");
    expect(review?.photos).toEqual([]);
    expect(review?.cover).toBeNull();
  });

  test("throws a descriptive error on invalid frontmatter", () => {
    expect(() => getReviews("cs", FIXTURES_INVALID)).toThrow(/bad-review/);
  });
});

describe("getReviewBySlug", () => {
  test("returns the review for an existing slug", () => {
    const review = getReviewBySlug("maringotka-u-lesa", "en", FIXTURES);
    expect(review?.title).toBe("Maringotka U Lesa");
    expect(review?.locale).toBe("en");
  });

  test("returns null for a missing slug", () => {
    expect(getReviewBySlug("neexistuje", "cs", FIXTURES)).toBeNull();
  });

  test("returns null for missing translation", () => {
    expect(getReviewBySlug("jurta-na-kopci", "en", FIXTURES)).toBeNull();
  });

  test("returns null for a draft", () => {
    expect(getReviewBySlug("tajny-koncept", "cs", FIXTURES)).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `bun test tests/content.test.ts`
Expected: FAIL — cannot resolve `@/lib/content`.

- [ ] **Step 4: Implement the loader**

`src/lib/content.ts`:

```ts
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import { type ReviewFrontmatter, reviewFrontmatterSchema } from "@/lib/schema";

export type Review = ReviewFrontmatter & {
  slug: string;
  locale: Locale;
  body: string;
  photos: string[];
  cover: string | null;
};

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), "content");
const PHOTO_RE = /\.(jpe?g|png|webp|avif)$/i;

function loadReview(slug: string, locale: Locale, contentDir: string): Review | null {
  const dir = path.join(contentDir, "reviews", slug);
  const file = path.join(dir, `${locale}.md`);
  if (!existsSync(file)) {
    if (locale === "cs") throw new Error(`[content] ${slug}: missing required cs.md`);
    console.warn(`[content] ${slug}: missing en.md — skipped in EN listing`);
    return null;
  }
  const { data, content } = matter(readFileSync(file, "utf8"));
  const parsed = reviewFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `[content] ${slug}/${locale}.md: invalid frontmatter\n${z.prettifyError(parsed.error)}`,
    );
  }
  const photosDir = path.join(dir, "photos");
  const files = existsSync(photosDir)
    ? readdirSync(photosDir).filter((f) => PHOTO_RE.test(f)).sort()
    : [];
  const photos = files.map((f) => `/reviews/${slug}/${f}`);
  const cover = files.includes("cover.jpg") ? `/reviews/${slug}/cover.jpg` : (photos[0] ?? null);
  return { ...parsed.data, slug, locale, body: content, photos, cover };
}

export function getReviews(locale: Locale, contentDir = DEFAULT_CONTENT_DIR): Review[] {
  const reviewsDir = path.join(contentDir, "reviews");
  if (!existsSync(reviewsDir)) return [];
  return readdirSync(reviewsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => loadReview(entry.name, locale, contentDir))
    .filter((review): review is Review => review !== null && review.published)
    .sort((a, b) => b.stayDate.getTime() - a.stayDate.getTime());
}

export function getReviewBySlug(
  slug: string,
  locale: Locale,
  contentDir = DEFAULT_CONTENT_DIR,
): Review | null {
  const dir = path.join(contentDir, "reviews", slug);
  if (!existsSync(dir)) return null;
  const review = loadReview(slug, locale, contentDir);
  return review?.published ? review : null;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test tests/content.test.ts`
Expected: PASS (a `missing en.md` warning printed for `jurta-na-kopci` and `tajny-koncept` is expected and correct).

- [ ] **Step 6: Commit**

```bash
git add src/lib/content.ts tests/content.test.ts tests/fixtures
git commit -m "feat: review content loader with build-time validation"
```

---

### Task 6: Static Page Loader (O nás / Pro majitele)

**Files:**
- Modify: `src/lib/content.ts` (append)
- Create fixtures: `tests/fixtures/content/pages/about.cs.md`, `tests/fixtures/content/pages/about.en.md`
- Test: `tests/pages.test.ts`

- [ ] **Step 1: Create fixtures**

`tests/fixtures/content/pages/about.cs.md`:

```markdown
---
title: "O nás"
---

Jsme Jarda a spol. a milujeme glamping.
```

`tests/fixtures/content/pages/about.en.md`:

```markdown
---
title: "About us"
---

We are a couple in love with glamping.
```

- [ ] **Step 2: Write the failing test**

`tests/pages.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import path from "node:path";
import { getPage } from "@/lib/content";

const FIXTURES = path.join(import.meta.dir, "fixtures", "content");

describe("getPage", () => {
  test("loads title and body per locale", () => {
    const cs = getPage("about", "cs", FIXTURES);
    expect(cs.title).toBe("O nás");
    expect(cs.body).toContain("milujeme glamping");

    const en = getPage("about", "en", FIXTURES);
    expect(en.title).toBe("About us");
  });

  test("throws for a missing page file", () => {
    expect(() => getPage("for-owners", "cs", FIXTURES)).toThrow(/for-owners/);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `bun test tests/pages.test.ts`
Expected: FAIL — `getPage` is not exported.

- [ ] **Step 4: Implement**

Append to `src/lib/content.ts`:

```ts
export type StaticPage = { title: string; body: string };
export type StaticPageName = "about" | "for-owners";

export function getPage(
  name: StaticPageName,
  locale: Locale,
  contentDir = DEFAULT_CONTENT_DIR,
): StaticPage {
  const file = path.join(contentDir, "pages", `${name}.${locale}.md`);
  if (!existsSync(file)) throw new Error(`[content] missing page file: ${name}.${locale}.md`);
  const { data, content } = matter(readFileSync(file, "utf8"));
  if (typeof data.title !== "string" || data.title.length === 0) {
    throw new Error(`[content] ${name}.${locale}.md: missing title in frontmatter`);
  }
  return { title: data.title, body: content };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test tests/pages.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/content.ts tests/pages.test.ts tests/fixtures/content/pages
git commit -m "feat: static page loader"
```

---

### Task 7: Photo Sync Script

**Files:**
- Create: `scripts/sync-photos.ts`
- Test: `tests/sync-photos.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sync-photos.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { syncPhotos } from "../scripts/sync-photos";

describe("syncPhotos", () => {
  test("copies content photos into public/reviews and clears stale output", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "photos-"));
    const photosDir = path.join(root, "content", "reviews", "glamp-a", "photos");
    mkdirSync(photosDir, { recursive: true });
    writeFileSync(path.join(photosDir, "cover.jpg"), "img");

    const staleDir = path.join(root, "public", "reviews", "deleted-glamp");
    mkdirSync(staleDir, { recursive: true });
    writeFileSync(path.join(staleDir, "old.jpg"), "old");

    syncPhotos(root);

    expect(existsSync(path.join(root, "public", "reviews", "glamp-a", "cover.jpg"))).toBe(true);
    expect(existsSync(staleDir)).toBe(false);
  });

  test("handles a project without any content gracefully", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "photos-empty-"));
    expect(() => syncPhotos(root)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/sync-photos.test.ts`
Expected: FAIL — cannot resolve `../scripts/sync-photos`.

- [ ] **Step 3: Implement**

`scripts/sync-photos.ts`:

```ts
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

export function syncPhotos(rootDir: string) {
  const reviewsDir = path.join(rootDir, "content", "reviews");
  const outDir = path.join(rootDir, "public", "reviews");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  if (!existsSync(reviewsDir)) return;
  for (const slug of readdirSync(reviewsDir)) {
    const photosDir = path.join(reviewsDir, slug, "photos");
    if (existsSync(photosDir)) {
      cpSync(photosDir, path.join(outDir, slug), { recursive: true });
    }
  }
}

if (import.meta.main) {
  syncPhotos(process.cwd());
  console.log("[photos] synced content/reviews/*/photos -> public/reviews/");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/sync-photos.test.ts`
Expected: PASS.

- [ ] **Step 5: Verify the npm scripts now work end-to-end**

Run: `bun run sync-photos`
Expected: prints the sync message; `public/reviews/` exists (empty — no real content yet).

- [ ] **Step 6: Commit**

```bash
git add scripts/sync-photos.ts tests/sync-photos.test.ts
git commit -m "feat: photo sync script wiring content photos into public/"
```

---

### Task 8: Design Foundation (Theme, Font, Header, Footer)

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/SetHtmlLang.tsx`, `src/app/en/layout.tsx`

- [ ] **Step 1: Write the theme CSS**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-cream: #faf6ef;
  --color-sand: #f1e8d8;
  --color-forest: #3d4a3a;
  --color-forest-dark: #2e3a2b;
  --color-moss: #8a9a5b;
  --color-terracotta: #b06b43;
  --color-terracotta-dark: #96552f;
  --font-display: var(--font-lora), Georgia, serif;
}

body {
  background-color: var(--color-cream);
  color: var(--color-forest);
}

/* Rendered markdown (review stories, static pages) */
.prose-body h1,
.prose-body h2,
.prose-body h3 {
  font-family: var(--font-display);
  color: var(--color-forest-dark);
  margin: 1.5em 0 0.5em;
}
.prose-body p {
  margin: 0.75em 0;
  line-height: 1.7;
}
.prose-body a {
  color: var(--color-terracotta);
  text-decoration: underline;
}
.prose-body ul {
  list-style: disc;
  padding-left: 1.5em;
  margin: 0.75em 0;
}
```

- [ ] **Step 2: Load Lora and set root metadata**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const lora = Lora({ subsets: ["latin", "latin-ext"], variable: "--font-lora" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "glampingcouple — poctivé recenze glampingů",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Jsme pár, který objíždí glampingy. Píšeme poctivě, co nás nadchlo — i co není domyšlené.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={lora.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create SetHtmlLang and the /en layout**

`src/components/SetHtmlLang.tsx` (the root layout hardcodes `lang="cs"`; Next.js allows only one root `<html>`, so English pages correct the attribute client-side — a small, static-friendly workaround):

```tsx
"use client";

import { useEffect } from "react";

export function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
```

`src/app/en/layout.tsx`:

```tsx
import { SetHtmlLang } from "@/components/SetHtmlLang";

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SetHtmlLang lang="en" />
      {children}
    </>
  );
}
```

- [ ] **Step 4: Create Header and Footer**

`src/components/Header.tsx`:

```tsx
import Link from "next/link";
import { type Locale, getDictionary, otherLocale, pagePath } from "@/lib/i18n";

export function Header({ locale, altHref }: { locale: Locale; altHref: string }) {
  const dict = getDictionary(locale);
  return (
    <header className="border-b border-forest/10 bg-cream/90">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href={pagePath("home", locale)} className="font-display text-xl font-semibold tracking-wide">
          glamping<span className="text-terracotta">couple</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href={pagePath("reviews", locale)} className="hover:text-terracotta">
            {dict.nav.reviews}
          </Link>
          <Link href={pagePath("about", locale)} className="hover:text-terracotta">
            {dict.nav.about}
          </Link>
          <Link
            href={pagePath("forOwners", locale)}
            className="rounded-full bg-forest px-4 py-1.5 text-cream hover:bg-forest-dark"
          >
            {dict.nav.forOwners}
          </Link>
          <Link href={altHref} className="font-semibold uppercase tracking-wider hover:text-terracotta">
            {otherLocale(locale) === "en" ? "EN" : "CZ"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

`src/components/Footer.tsx`:

```tsx
import { type Locale, getDictionary } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="mt-20 border-t border-forest/10 bg-sand/60">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm">
        <p className="font-display font-semibold">glampingcouple.com</p>
        <p>{dict.footer.tagline}</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-terracotta">
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `bun run build`
Expected: succeeds (Header/Footer are not yet referenced by pages — that comes next; the build proves the theme and layout compile).

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/app/en src/components
git commit -m "feat: design foundation - earthy theme, Lora font, header and footer"
```

---

### Task 9: Real Sample Content

**Files:**
- Create: `content/reviews/maringotka-u-lesa/{cs.md,en.md}`, `content/reviews/treehouse-pod-jestedem/{cs.md,en.md}`, `content/pages/{about,for-owners}.{cs,en}.md`
- Test: `tests/content-integration.test.ts`

Note: these two reviews are realistic placeholders demonstrating the format. **TODO-USER: replace with the couple's real stays and drop real photos into each `photos/` folder** (`cover.jpg` + any number of `01.jpg`, `02.jpg`…).

- [ ] **Step 1: Create the review content**

`content/reviews/maringotka-u-lesa/cs.md`:

```markdown
---
title: "Maringotka U Lesa"
location: "Jižní Čechy"
stayDate: 2026-06-20
score: 9
verdict: "Nejlepší maringotka, ve které jsme kdy spali — chybí jen maličkosti."
liked:
  - "Vana pod širým nebem s výhledem na rybník"
  - "Snídaňový košík od místního pekaře"
  - "Perfektně vybavená venkovní kuchyňka"
notThoughtThrough:
  - "Jižní okno nemá stínění, v létě se maringotka přehřívá"
  - "Chybí háčky na mokré ručníky a plavky"
tags: ["maringotka", "rybník"]
published: true
---

Přijeli jsme v pátek podvečer a první, co nás uvítalo, byla vůně lesa a
naprosté ticho. Maringotka stojí na kraji louky u rybníka a všechno v ní
voní dřevem.

Ráno nás vzbudilo slunce nad hladinou. Káva z venkovní kuchyňky, čerstvé
pečivo z košíku a dvě hodiny ve vaně pod širým nebem — přesně takhle má
glamping vypadat.
```

`content/reviews/maringotka-u-lesa/en.md`:

```markdown
---
title: "Maringotka U Lesa"
location: "South Bohemia"
stayDate: 2026-06-20
score: 9
verdict: "The best shepherd's hut we have ever slept in — only small details are missing."
liked:
  - "Open-air bathtub overlooking the pond"
  - "Breakfast basket from a local bakery"
  - "Perfectly equipped outdoor kitchen"
notThoughtThrough:
  - "The south-facing window has no shading, the hut overheats in summer"
  - "No hooks for wet towels and swimwear"
tags: ["maringotka", "pond"]
published: true
---

We arrived on Friday evening and were greeted by the scent of the forest
and complete silence. The hut stands at the edge of a meadow by a pond and
everything inside smells of wood.

In the morning the sun over the water woke us up. Coffee from the outdoor
kitchen, fresh pastries from the basket and two hours in the open-air
bathtub — this is exactly what glamping should feel like.
```

`content/reviews/treehouse-pod-jestedem/cs.md`:

```markdown
---
title: "Treehouse pod Ještědem"
location: "Liberecký kraj"
stayDate: 2026-05-16
score: 8
verdict: "Kouzelné místo, které by s pár úpravami bylo dokonalé."
liked:
  - "Ranní výhled na Ještěd přímo z postele"
  - "Poctivá lokální snídaně"
notThoughtThrough:
  - "Cesta na toaletu v noci není osvětlená"
  - "Chybí místo na uložení batohů"
tags: ["treehouse", "hory"]
published: true
---

Spát v korunách stromů s výhledem na Ještěd je zážitek, na který se
nezapomíná. Treehouse je postavený s citem a láskou k detailu.

Večer jsme seděli na terase s dekou a čajem a poslouchali les. Jen ta
noční výprava na toaletu s čelovkou by si zasloužila pár solárních lampiček.
```

`content/reviews/treehouse-pod-jestedem/en.md`:

```markdown
---
title: "Treehouse pod Ještědem"
location: "Liberec Region"
stayDate: 2026-05-16
score: 8
verdict: "A magical place that would be perfect with a few tweaks."
liked:
  - "Morning view of Ještěd straight from the bed"
  - "Hearty local breakfast"
notThoughtThrough:
  - "The path to the toilet is not lit at night"
  - "Nowhere to store backpacks"
tags: ["treehouse", "mountains"]
published: true
---

Sleeping in the treetops with a view of Ještěd is an experience you never
forget. The treehouse is built with care and love for detail.

In the evening we sat on the terrace with a blanket and tea, listening to
the forest. Only the nightly headlamp expedition to the toilet deserves a
few solar lamps.
```

- [ ] **Step 2: Create the static pages**

`content/pages/about.cs.md`:

```markdown
---
title: "O nás"
---

Jsme pár, který si jednoho léta půjčil stan se skutečnou postelí — a od té
doby jsme propadli glampingu. Objíždíme maringotky, jurty, treehousy i
safari stany po Česku a okolí.

Při každém pobytu si všímáme detailů: co funguje skvěle a co by šlo udělat
lépe. Naše recenze jsou poctivé — píšeme to, co bychom sami chtěli vědět,
než někam pojedeme.
```

`content/pages/about.en.md`:

```markdown
---
title: "About us"
---

We are a couple who one summer rented a tent with a real bed — and have
been hooked on glamping ever since. We tour shepherd's huts, yurts,
treehouses and safari tents across Czechia and beyond.

During every stay we notice the details: what works brilliantly and what
could be done better. Our reviews are honest — we write what we would want
to know ourselves before booking.
```

`content/pages/for-owners.cs.md`:

```markdown
---
title: "Pro majitele"
---

Provozujete glamping a chcete pohled zvenčí? Pozvěte nás na pobyt.

**Co od nás dostanete:**

- Poctivou recenzi na tomto webu — česky i anglicky
- Konkrétní seznam věcí, které hostům chybí nebo je ruší
- Fotky z pobytu, které můžete použít
- Doporučení, co vylepšit — od maličkostí po větší nápady

Nejsme influenceři, kteří pochválí všechno. Píšeme to, co vaši hosté
vidí, ale neřeknou vám. Právě ty nedomyšlené detaily rozhodují o tom,
jestli se hosté vrátí.
```

`content/pages/for-owners.en.md`:

```markdown
---
title: "For owners"
---

Do you run a glamping and want an outside perspective? Invite us for a stay.

**What you get from us:**

- An honest review on this website — in Czech and English
- A concrete list of things your guests miss or find annoying
- Photos from the stay that you are free to use
- Recommendations on what to improve — from small details to bigger ideas

We are not influencers who praise everything. We write what your guests
notice but never tell you. It is exactly those overlooked details that
decide whether guests come back.
```

- [ ] **Step 3: Write the integration test guarding real content**

`tests/content-integration.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import path from "node:path";
import { getPage, getReviewBySlug, getReviews } from "@/lib/content";
import { LOCALES } from "@/lib/i18n";

describe("real content directory", () => {
  test("every review folder loads (or is an explicit draft) in czech", () => {
    const reviews = getReviews("cs"); // throws on any invalid folder — that alone guards content
    const slugs = new Set(reviews.map((r) => r.slug));
    const folders = readdirSync(path.join(process.cwd(), "content", "reviews"));
    for (const folder of folders) {
      const review = getReviewBySlug(folder, "cs");
      // published folders must appear in the listing; the only legitimate absence is a draft
      if (review) expect(slugs.has(folder)).toBe(true);
    }
    expect(slugs.size).toBeGreaterThan(0);
  });

  test("english listing loads without crashing", () => {
    expect(() => getReviews("en")).not.toThrow();
  });

  test("all static pages exist in all locales", () => {
    for (const locale of LOCALES) {
      expect(getPage("about", locale).title.length).toBeGreaterThan(0);
      expect(getPage("for-owners", locale).title.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 4: Run the tests**

Run: `bun test tests/content-integration.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content tests/content-integration.test.ts
git commit -m "feat: sample review and page content in czech and english"
```

---

### Task 10: Reviews List Pages + ReviewCard

**Files:**
- Create: `src/components/ScoreBadge.tsx`, `src/components/ReviewCard.tsx`, `src/lib/seo.ts`, `src/components/pages/ReviewsListPage.tsx`, `src/app/recenze/page.tsx`, `src/app/en/reviews/page.tsx`

- [ ] **Step 1: Create the SEO metadata helper**

`src/lib/seo.ts`:

```ts
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

export function pageMetadata(opts: {
  locale: Locale;
  title: string;
  description: string;
  csPath: string;
  enPath: string;
  ogImage?: string;
}): Metadata {
  const { locale, title, description, csPath, enPath, ogImage } = opts;
  return {
    title,
    description,
    alternates: {
      canonical: locale === "cs" ? csPath : enPath,
      languages: { cs: csPath, en: enPath, "x-default": csPath },
    },
    openGraph: {
      title,
      description,
      locale: locale === "cs" ? "cs_CZ" : "en_GB",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
```

- [ ] **Step 2: Create ScoreBadge and ReviewCard**

`src/components/ScoreBadge.tsx`:

```tsx
export function ScoreBadge({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const classes =
    size === "lg"
      ? "h-16 w-16 text-2xl"
      : "h-10 w-10 text-sm";
  return (
    <span
      className={`${classes} inline-flex shrink-0 items-center justify-center rounded-full bg-forest font-display font-bold text-cream`}
    >
      {score}
    </span>
  );
}
```

`src/components/ReviewCard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { ScoreBadge } from "@/components/ScoreBadge";
import type { Review } from "@/lib/content";
import { getDictionary, reviewPath } from "@/lib/i18n";

export function ReviewCard({ review }: { review: Review }) {
  const dict = getDictionary(review.locale);
  return (
    <Link
      href={reviewPath(review.locale, review.slug)}
      className="group overflow-hidden rounded-2xl border border-forest/10 bg-white/60 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-moss to-forest">
        {review.cover ? (
          <Image
            src={review.cover}
            alt={review.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-5xl">🏕️</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-forest-dark">{review.title}</h3>
          <p className="mt-1 text-sm text-forest/70">{review.location}</p>
          <p className="mt-3 text-sm italic text-forest/80">„{review.verdict}"</p>
          <p className="mt-3 text-sm font-semibold text-terracotta">{dict.reviews.readMore} →</p>
        </div>
        <ScoreBadge score={review.score} />
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Create the shared list page component**

`src/components/pages/ReviewsListPage.tsx`:

```tsx
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReviewCard } from "@/components/ReviewCard";
import { getReviews } from "@/lib/content";
import { type Locale, getDictionary, otherLocale, pagePath } from "@/lib/i18n";

export function ReviewsListPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const reviews = getReviews(locale);
  return (
    <>
      <Header locale={locale} altHref={pagePath("reviews", otherLocale(locale))} />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-display text-3xl font-semibold text-forest-dark sm:text-4xl">
          {dict.reviews.title}
        </h1>
        {reviews.length === 0 ? (
          <p className="mt-8 text-forest/70">{dict.reviews.empty}</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
```

- [ ] **Step 4: Create the two route files**

`src/app/recenze/page.tsx`:

```tsx
import { ReviewsListPage } from "@/components/pages/ReviewsListPage";
import { getDictionary, pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "cs",
  title: getDictionary("cs").reviews.title,
  description: "Poctivé recenze glampingů po Česku i okolí.",
  csPath: pagePath("reviews", "cs"),
  enPath: pagePath("reviews", "en"),
});

export default function Page() {
  return <ReviewsListPage locale="cs" />;
}
```

`src/app/en/reviews/page.tsx`:

```tsx
import { ReviewsListPage } from "@/components/pages/ReviewsListPage";
import { getDictionary, pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  title: getDictionary("en").reviews.title,
  description: "Honest glamping reviews across Czechia and beyond.",
  csPath: pagePath("reviews", "cs"),
  enPath: pagePath("reviews", "en"),
});

export default function Page() {
  return <ReviewsListPage locale="en" />;
}
```

- [ ] **Step 5: Verify build**

Run: `bun run build`
Expected: succeeds; `/recenze` and `/en/reviews` in the route list as static pages.

- [ ] **Step 6: Commit**

```bash
git add src/components src/lib/seo.ts src/app/recenze src/app/en/reviews
git commit -m "feat: reviews list pages with review cards"
```

---

### Task 11: Review Detail Pages

**Files:**
- Create: `src/components/ProsCons.tsx`, `src/components/VerdictBox.tsx`, `src/components/Gallery.tsx`, `src/components/pages/ReviewDetailPage.tsx`, `src/app/recenze/[slug]/page.tsx`, `src/app/en/reviews/[slug]/page.tsx`

- [ ] **Step 1: Create the review building blocks**

`src/components/ProsCons.tsx`:

```tsx
import type { Dictionary } from "@/lib/i18n";

export function ProsCons({
  liked,
  notThoughtThrough,
  dict,
}: {
  liked: string[];
  notThoughtThrough: string[];
  dict: Dictionary;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <section className="rounded-2xl bg-moss/15 p-6">
        <h2 className="font-display text-lg font-semibold text-forest-dark">
          ✓ {dict.review.liked}
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {liked.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="font-bold text-moss">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-2xl bg-terracotta/10 p-6">
        <h2 className="font-display text-lg font-semibold text-terracotta-dark">
          ✗ {dict.review.notThoughtThrough}
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {notThoughtThrough.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="font-bold text-terracotta">✗</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

`src/components/VerdictBox.tsx`:

```tsx
import { ScoreBadge } from "@/components/ScoreBadge";
import type { Dictionary } from "@/lib/i18n";

export function VerdictBox({
  score,
  verdict,
  dict,
}: {
  score: number;
  verdict: string;
  dict: Dictionary;
}) {
  return (
    <section className="flex items-center gap-6 rounded-2xl bg-forest p-6 text-cream sm:p-8">
      <ScoreBadge score={score} size="lg" />
      <div>
        <h2 className="font-display text-lg font-semibold">{dict.review.verdict}</h2>
        <p className="mt-1 italic text-cream/90">„{verdict}"</p>
      </div>
    </section>
  );
}
```

Note: `ScoreBadge` uses `bg-forest text-cream`, invisible on the forest verdict box — add a variant. Update `src/components/ScoreBadge.tsx`:

```tsx
export function ScoreBadge({
  score,
  size = "sm",
  variant = "forest",
}: {
  score: number;
  size?: "sm" | "lg";
  variant?: "forest" | "cream";
}) {
  const sizeClasses = size === "lg" ? "h-16 w-16 text-2xl" : "h-10 w-10 text-sm";
  const colorClasses =
    variant === "cream" ? "bg-cream text-forest" : "bg-forest text-cream";
  return (
    <span
      className={`${sizeClasses} ${colorClasses} inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold`}
    >
      {score}
    </span>
  );
}
```

…and in `VerdictBox` use `<ScoreBadge score={score} size="lg" variant="cream" />`.

`src/components/Gallery.tsx`:

```tsx
import Image from "next/image";

export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  if (photos.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((src, i) => (
        <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={`${title} — foto ${i + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create the shared detail page component**

`src/components/pages/ReviewDetailPage.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { ProsCons } from "@/components/ProsCons";
import { VerdictBox } from "@/components/VerdictBox";
import { getReviewBySlug } from "@/lib/content";
import {
  type Locale,
  formatStayDate,
  getDictionary,
  otherLocale,
  pagePath,
  reviewPath,
} from "@/lib/i18n";
import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";

export async function ReviewDetailPage({ locale, slug }: { locale: Locale; slug: string }) {
  const review = getReviewBySlug(slug, locale);
  if (!review) notFound();
  const dict = getDictionary(locale);
  const other = otherLocale(locale);
  const altHref = getReviewBySlug(slug, other)
    ? reviewPath(other, slug)
    : pagePath("reviews", other);
  const bodyHtml = await markdownToHtml(review.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Campground", name: review.title, address: review.location },
    reviewRating: { "@type": "Rating", ratingValue: review.score, bestRating: 10, worstRating: 1 },
    author: { "@type": "Person", name: "Glamping Couple" },
    datePublished: review.stayDate.toISOString().slice(0, 10),
    reviewBody: review.verdict,
    url: `${SITE_URL}${reviewPath(locale, slug)}`,
  };

  return (
    <>
      <Header locale={locale} altHref={altHref} />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from validated build-time content
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link href={pagePath("reviews", locale)} className="text-sm text-terracotta underline">
          ← {dict.review.backToReviews}
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-forest-dark sm:text-4xl">
          {review.title}
        </h1>
        <p className="mt-2 text-forest/70">
          {review.location} · {dict.review.stayDate}: {formatStayDate(review.stayDate, locale)}
        </p>

        <article
          className="prose-body mt-8"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: html produced by our own remark pipeline from repo content
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <div className="mt-10">
          <Gallery photos={review.photos} title={review.title} />
        </div>

        <div className="mt-10">
          <ProsCons liked={review.liked} notThoughtThrough={review.notThoughtThrough} dict={dict} />
        </div>

        <div className="mt-10">
          <VerdictBox score={review.score} verdict={review.verdict} dict={dict} />
        </div>

        <section className="mt-14 rounded-2xl border border-forest/15 bg-sand/60 p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-forest-dark">
            {dict.review.ctaTitle}
          </h2>
          <Link
            href={pagePath("forOwners", locale)}
            className="mt-4 inline-block rounded-full bg-terracotta px-6 py-2 font-semibold text-cream hover:bg-terracotta-dark"
          >
            {dict.review.ctaButton}
          </Link>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
```

- [ ] **Step 3: Create the two route files**

`src/app/recenze/[slug]/page.tsx`:

```tsx
import { ReviewDetailPage } from "@/components/pages/ReviewDetailPage";
import { getReviewBySlug, getReviews } from "@/lib/content";
import { pagePath, reviewPath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getReviews("cs").map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = getReviewBySlug(slug, "cs");
  if (!review) return {};
  return pageMetadata({
    locale: "cs",
    title: `${review.title} — recenze`,
    description: review.verdict,
    csPath: reviewPath("cs", slug),
    enPath: getReviewBySlug(slug, "en") ? reviewPath("en", slug) : pagePath("reviews", "en"),
    ogImage: review.cover ?? undefined,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ReviewDetailPage locale="cs" slug={slug} />;
}
```

`src/app/en/reviews/[slug]/page.tsx`:

```tsx
import { ReviewDetailPage } from "@/components/pages/ReviewDetailPage";
import { getReviewBySlug, getReviews } from "@/lib/content";
import { reviewPath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getReviews("en").map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = getReviewBySlug(slug, "en");
  if (!review) return {};
  return pageMetadata({
    locale: "en",
    title: `${review.title} — review`,
    description: review.verdict,
    csPath: reviewPath("cs", slug),
    enPath: reviewPath("en", slug),
    ogImage: review.cover ?? undefined,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ReviewDetailPage locale="en" slug={slug} />;
}
```

- [ ] **Step 4: Verify build**

Run: `bun run build`
Expected: succeeds; `/recenze/maringotka-u-lesa`, `/recenze/treehouse-pod-jestedem` and both `/en/reviews/...` counterparts appear as statically generated routes.

- [ ] **Step 5: Commit**

```bash
git add src/components src/app/recenze src/app/en/reviews
git commit -m "feat: review detail pages with gallery, pros/cons, verdict and json-ld"
```

---

### Task 12: Homepage

**Files:**
- Create: `src/components/pages/HomePage.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/en/page.tsx`

- [ ] **Step 1: Create the shared homepage component**

`src/components/pages/HomePage.tsx`:

```tsx
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReviewCard } from "@/components/ReviewCard";
import { getReviews } from "@/lib/content";
import { type Locale, getDictionary, otherLocale, pagePath } from "@/lib/i18n";

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const latest = getReviews(locale).slice(0, 3);
  const steps = [
    { title: dict.home.howStep1Title, text: dict.home.howStep1Text },
    { title: dict.home.howStep2Title, text: dict.home.howStep2Text },
    { title: dict.home.howStep3Title, text: dict.home.howStep3Text },
  ];

  return (
    <>
      <Header locale={locale} altHref={pagePath("home", otherLocale(locale))} />
      <main className="mx-auto max-w-5xl px-4">
        <section className="max-w-2xl py-16 sm:py-24">
          <h1 className="font-display text-4xl leading-tight text-forest-dark sm:text-5xl">
            {dict.home.heroTitle}{" "}
            <em className="not-italic text-terracotta">{dict.home.heroAccent}</em>
          </h1>
          <p className="mt-6 text-lg text-forest/80">{dict.home.heroText}</p>
          <Link
            href={pagePath("forOwners", locale)}
            className="mt-8 inline-block rounded-full bg-forest px-7 py-3 font-semibold text-cream hover:bg-forest-dark"
          >
            {dict.home.heroCta} →
          </Link>
        </section>

        <section className="py-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-forest-dark">
              {dict.home.latestTitle}
            </h2>
            <Link href={pagePath("reviews", locale)} className="text-sm text-terracotta underline">
              {dict.home.allReviews} →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="font-display text-2xl font-semibold text-forest-dark">
            {dict.home.howTitle}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-forest/10 bg-white/50 p-6">
                <span className="font-display text-3xl font-bold text-moss">{i + 1}</span>
                <h3 className="mt-2 font-display font-semibold text-forest-dark">{step.title}</h3>
                <p className="mt-2 text-sm text-forest/80">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-3xl bg-forest p-8 text-cream sm:p-12">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {dict.home.ownersTitle}
          </h2>
          <p className="mt-3 max-w-xl text-cream/90">{dict.home.ownersText}</p>
          <Link
            href={pagePath("forOwners", locale)}
            className="mt-6 inline-block rounded-full bg-terracotta px-7 py-3 font-semibold text-cream hover:bg-terracotta-dark"
          >
            {dict.home.ownersCta} →
          </Link>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
```

- [ ] **Step 2: Wire up the route files**

Replace `src/app/page.tsx`:

```tsx
import { HomePage } from "@/components/pages/HomePage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "cs",
  title: "glampingcouple — poctivé recenze glampingů",
  description:
    "Jsme pár, který objíždí glampingy. Píšeme poctivě, co nás nadchlo — i co není domyšlené.",
  csPath: pagePath("home", "cs"),
  enPath: pagePath("home", "en"),
});

export default function Page() {
  return <HomePage locale="cs" />;
}
```

Create `src/app/en/page.tsx`:

```tsx
import { HomePage } from "@/components/pages/HomePage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  title: "glampingcouple — honest glamping reviews",
  description:
    "We are a couple touring glampings. We write honestly about what delighted us — and what isn't thought through.",
  csPath: pagePath("home", "cs"),
  enPath: pagePath("home", "en"),
});

export default function Page() {
  return <HomePage locale="en" />;
}
```

- [ ] **Step 3: Verify visually**

Run: `bun run dev` and open `http://localhost:3000` and `http://localhost:3000/en`.
Expected: hero, 2 review cards, "how we review" strip, owners CTA banner; language switcher flips between `/` and `/en`.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/HomePage.tsx src/app/page.tsx src/app/en/page.tsx
git commit -m "feat: bilingual homepage"
```

---

### Task 13: About, For-Owners Pages & Contact Form

**Files:**
- Create: `src/components/ContactForm.tsx`, `src/components/pages/StaticContentPage.tsx`, `src/app/o-nas/page.tsx`, `src/app/pro-majitele/page.tsx`, `src/app/en/about/page.tsx`, `src/app/en/for-owners/page.tsx`, `.env.example`

- [ ] **Step 1: Create the contact form (client component)**

`src/components/ContactForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";

export function ContactForm({ dict, email }: { dict: Dictionary; email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!FORM_ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      });
      setStatus(response.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-terracotta";

  return (
    <div>
      {status === "ok" ? (
        <p className="rounded-xl bg-moss/20 p-4 font-semibold text-forest-dark">
          {dict.contact.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="name" required placeholder={dict.contact.name} className={inputClasses} />
          <input
            name="email"
            type="email"
            required
            placeholder={dict.contact.email}
            className={inputClasses}
          />
          <input
            name="glamping"
            required
            placeholder={dict.contact.glamping}
            className={inputClasses}
          />
          <input name="website" placeholder={dict.contact.website} className={inputClasses} />
          <textarea
            name="message"
            required
            rows={5}
            placeholder={dict.contact.message}
            className={inputClasses}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-terracotta px-7 py-2.5 font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-60"
          >
            {status === "sending" ? dict.contact.sending : dict.contact.send}
          </button>
          {status === "error" && (
            <p className="rounded-xl bg-terracotta/15 p-4 text-sm text-terracotta-dark">
              {dict.contact.error}
            </p>
          )}
        </form>
      )}
      <p className="mt-6 text-sm text-forest/70">
        {dict.contact.emailIntro}{" "}
        <a href={`mailto:${email}`} className="font-semibold text-terracotta underline">
          {email}
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create the shared static-content page component**

`src/components/pages/StaticContentPage.tsx`:

```tsx
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { type StaticPageName, getPage } from "@/lib/content";
import { type Locale, type PageKey, getDictionary, otherLocale, pagePath } from "@/lib/i18n";
import { markdownToHtml } from "@/lib/markdown";
import { CONTACT_EMAIL } from "@/lib/site";

export async function StaticContentPage({
  locale,
  name,
  pageKey,
  withContactForm = false,
}: {
  locale: Locale;
  name: StaticPageName;
  pageKey: PageKey;
  withContactForm?: boolean;
}) {
  const dict = getDictionary(locale);
  const page = getPage(name, locale);
  const bodyHtml = await markdownToHtml(page.body);

  return (
    <>
      <Header locale={locale} altHref={pagePath(pageKey, otherLocale(locale))} />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-semibold text-forest-dark sm:text-4xl">
          {page.title}
        </h1>
        <article
          className="prose-body mt-6"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: html produced by our own remark pipeline from repo content
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        {withContactForm && (
          <section className="mt-12 rounded-2xl border border-forest/15 bg-sand/50 p-6 sm:p-8">
            <ContactForm dict={dict} email={CONTACT_EMAIL} />
          </section>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
```

- [ ] **Step 3: Create the four route files**

`src/app/o-nas/page.tsx`:

```tsx
import { StaticContentPage } from "@/components/pages/StaticContentPage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "cs",
  title: "O nás",
  description: "Kdo jsme a proč recenzujeme glampingy.",
  csPath: pagePath("about", "cs"),
  enPath: pagePath("about", "en"),
});

export default function Page() {
  return <StaticContentPage locale="cs" name="about" pageKey="about" />;
}
```

`src/app/en/about/page.tsx`:

```tsx
import { StaticContentPage } from "@/components/pages/StaticContentPage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  title: "About us",
  description: "Who we are and why we review glampings.",
  csPath: pagePath("about", "cs"),
  enPath: pagePath("about", "en"),
});

export default function Page() {
  return <StaticContentPage locale="en" name="about" pageKey="about" />;
}
```

`src/app/pro-majitele/page.tsx`:

```tsx
import { StaticContentPage } from "@/components/pages/StaticContentPage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "cs",
  title: "Pro majitele",
  description: "Pozvěte nás na pobyt — napíšeme poctivou recenzi a pomůžeme vám zlepšit váš glamping.",
  csPath: pagePath("forOwners", "cs"),
  enPath: pagePath("forOwners", "en"),
});

export default function Page() {
  return <StaticContentPage locale="cs" name="for-owners" pageKey="forOwners" withContactForm />;
}
```

`src/app/en/for-owners/page.tsx`:

```tsx
import { StaticContentPage } from "@/components/pages/StaticContentPage";
import { pagePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  title: "For owners",
  description: "Invite us for a stay — we'll write an honest review and help you improve your glamping.",
  csPath: pagePath("forOwners", "cs"),
  enPath: pagePath("forOwners", "en"),
});

export default function Page() {
  return <StaticContentPage locale="en" name="for-owners" pageKey="forOwners" withContactForm />;
}
```

- [ ] **Step 4: Create .env.example**

`.env.example`:

```
# Formspree form endpoint, e.g. https://formspree.io/f/abcdwxyz
# TODO-USER: create a free form at https://formspree.io and paste its endpoint here,
# then copy this file to .env.local (and set the same variable in Vercel).
NEXT_PUBLIC_FORMSPREE_ENDPOINT=
# Absolute site URL used in sitemap/OG tags (defaults to https://glampingcouple.com)
NEXT_PUBLIC_SITE_URL=https://glampingcouple.com
```

- [ ] **Step 5: Verify build and behavior**

Run: `bun run build`
Expected: succeeds; `/o-nas`, `/pro-majitele`, `/en/about`, `/en/for-owners` static.

Run: `bun run dev`, open `/pro-majitele`, submit the empty-endpoint form.
Expected: the error message with the e-mail fallback appears (endpoint not configured yet — correct behavior).

- [ ] **Step 6: Commit**

```bash
git add src/components src/app/o-nas src/app/pro-majitele src/app/en .env.example
git commit -m "feat: about and for-owners pages with contact form"
```

---

### Task 14: SEO Polish — Sitemap, Robots, 404

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/not-found.tsx`

- [ ] **Step 1: Create the sitemap**

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { getReviews } from "@/lib/content";
import { LOCALES, type PageKey, pagePath, reviewPath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: PageKey[] = ["home", "reviews", "about", "forOwners"];
  const staticEntries = pages.flatMap((page) =>
    LOCALES.map((locale) => ({ url: `${SITE_URL}${pagePath(page, locale)}` })),
  );
  const reviewEntries = LOCALES.flatMap((locale) =>
    getReviews(locale).map((review) => ({
      url: `${SITE_URL}${reviewPath(locale, review.slug)}`,
      lastModified: review.stayDate,
    })),
  );
  return [...staticEntries, ...reviewEntries];
}
```

- [ ] **Step 2: Create robots.ts**

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Create the bilingual 404 page**

`src/app/not-found.tsx`:

```tsx
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const cs = getDictionary("cs");
  const en = getDictionary("en");
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-bold text-moss">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-dark">
        {cs.notFound.title} · {en.notFound.title}
      </h1>
      <div className="mt-6 flex gap-4">
        <Link href="/" className="rounded-full bg-forest px-6 py-2 text-cream hover:bg-forest-dark">
          {cs.notFound.back}
        </Link>
        <Link
          href="/en"
          className="rounded-full border border-forest px-6 py-2 text-forest hover:bg-sand"
        >
          {en.notFound.back}
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run: `bun run build`
Expected: succeeds; `/sitemap.xml` and `/robots.txt` in the route list.

Run: `bun run dev`, open `http://localhost:3000/neexistuje`.
Expected: bilingual 404 page.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/not-found.tsx
git commit -m "feat: sitemap, robots and bilingual 404"
```

---

### Task 15: Final Verification, README & Deployment Checklist

**Files:**
- Create: `README.md`

- [ ] **Step 1: Full verification suite**

```bash
bun run lint      # expected: no errors
bun test          # expected: all tests pass
bun run build     # expected: all routes statically generated
```

Fix anything that fails before proceeding. Then start `bun run dev` and click through every page in both languages, checking: language switcher on every page, review detail renders story/gallery-placeholder/boxes/verdict, contact form error fallback, 404.

- [ ] **Step 2: Write README.md**

```markdown
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
   liked[], notThoughtThrough[], tags[], published) + story as the body.
3. Translate to `en.md` (same slug, same frontmatter shape). Missing `en.md`
   just hides the review from the English site.
4. Drop photos into `photos/` — `cover.jpg` is the card/OG image.
5. `bun run build` validates everything; invalid frontmatter fails the build.

Set `published: false` for drafts.

## Environment

Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: readme with authoring workflow"
```

- [ ] **Step 4: Manual deployment checklist (user actions — not automatable here)**

Present this checklist to the user:

1. Create a GitHub repo and push (`git remote add origin … && git push -u origin main`), or deploy via `vercel` CLI.
2. Import the repo in Vercel — it auto-detects Next.js + Bun (`bun.lock`). Build command stays `bun run build`.
3. Create a free form at formspree.io; set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in Vercel env vars.
4. Set `NEXT_PUBLIC_SITE_URL=https://glampingcouple.com` in Vercel env vars.
5. Add domains: `glampingcouple.com` (primary) and `glampingcouple.cz` (redirect to .com) in Vercel domain settings.
6. Replace `CONTACT_EMAIL` in `src/lib/site.ts` with the real address (currently `ahoj@glampingcouple.com`).
7. Replace the two sample reviews with real stays + photos.
