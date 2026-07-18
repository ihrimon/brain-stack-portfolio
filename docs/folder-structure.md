# Brain Stack — Folder Structure Reference

**Scope:** the current, as-of-2026-07-18 folder tree, reviewed against enterprise-standard organization. This is a review document — no folders were restructured or renamed this pass; only confirmed-dead files inside existing folders were removed (see §5).

---

## 1. Top-level tree

```
brain-stack/
├── app/                  # Routes only — App Router, one folder per URL segment
├── components/           # All UI, grouped by role (see §3)
├── lib/                  # Data, business logic, integrations, utilities
├── hooks/                # Custom React hooks (currently empty — see §4)
├── public/               # Static assets (images, icons, videos)
├── scripts/              # One-off/dev-time Node scripts (CSV export, Sheet migration)
├── docs/                 # This documentation set
├── .env.example          # Env var template
├── components.json       # shadcn/ui config
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

## 2. `app/` — routes

```
app/
├── layout.tsx            # Root layout: fonts, ThemeProvider, SmoothScroll, Navbar/Footer
├── page.tsx               # / (home)
├── loading.tsx            # Root loading UI (Suspense fallback)
├── error.tsx               # Root error boundary
├── not-found.tsx           # 404 page
├── globals.css             # Tailwind v4 theme tokens + base layer
├── sitemap.ts               # /sitemap.xml
├── robots.ts                 # /robots.txt
├── about/page.tsx
├── services/page.tsx
├── contact/page.tsx
├── projects/page.tsx
├── projects/[slug]/page.tsx
├── blog/page.tsx
└── blog/[slug]/page.tsx
```

**Assessment: enterprise-standard.** Every file here is either a route, a route-level convention file (`layout`/`loading`/`error`/`not-found`), or a Metadata API route (`sitemap.ts`/`robots.ts`). Zero business logic lives in `app/` — every page is a thin composition of section components fed by a `lib/utils/sheets/*` fetch. This is exactly the separation App Router is designed around, and it's followed with no exceptions across all 7 routes.

## 3. `components/` — grouped by role, not by page

```
components/
├── sections/    # 24 files — one per composed page section (Hero, CTA, ProjectDetails, ...)
├── layout/      # Navbar, Footer, MobileNav, SmoothScroll, SettingsDrawer
├── buttons/     # PrimaryButton, SecondaryButton, CircleViewButton
├── common/      # Logo, ThemeToggle, SectionBadge, ColorPaletteSwitcher, ScrollButton
├── animations/  # Cursor, Loader, MagneticButton, ParallaxImage, DiagonalPattern
├── shared/      # marquee.tsx (the only file left after this pass' cleanup — see §5)
├── theme/       # next-themes wrapper
├── three/       # BrainWireframe (React Three Fiber, dynamically imported)
├── ui/          # shadcn primitives: button, carousel, drawer
└── cards/       # Currently empty (see §5) — pending a real reusable card component
```

**Assessment: enterprise-standard, with one thing to watch.** Grouping by *role* (`buttons/`, `animations/`, `common/`) rather than by *page* is the right call for a component library this size — it makes "is there already a button for this?" a one-folder lookup instead of a project-wide search. The one thing to plan for: `sections/` is a flat 24-file bucket. That's still navigable today; past ~40 files, split into `sections/home/`, `sections/about/`, etc. (documented already in `coding-guidelines.md`).

`components/cards/` is empty after this pass removed its one (unused) file. Leaving the empty folder in place rather than deleting it — it's a reasonable place for the next genuinely-reusable card component, and an empty directory costs nothing (git won't even track it until something's added).

## 4. `lib/` — data, integrations, utilities

```
lib/
├── data/                 # Per-page typed seed/fallback content + shared-types.ts
│   ├── home-page.ts, about-page.ts, service-page.ts, projects-page.ts, blog-page.ts
│   └── shared-types.ts    # ButtonLink, Stat, Testimonial, SectionHeader, ProcessStep, FeatureCard, ServiceOffering, FAQItem
├── utils/sheets/          # Per-page Google Sheets fetch + parse, mirrors lib/data/ 1:1
│   ├── home.ts, about.ts, service.ts, blog.ts, projects.ts
│   ├── shared.ts           # getSheetsClient, parseJson, parseJsonObject, fetchKeyValueTab, withRetry
│   └── index.ts             # Barrel export — re-exports every fetcher + column-contract constant
├── utils/                  # cn.ts, format-date.ts, reading-time.ts, icons.ts, image-placeholder.ts
├── animations/               # gsap-animations.ts (reusable GSAP effects), lenis.ts (smooth-scroll singleton)
├── constants/                 # navigation.ts, footer.ts, contact.ts, color-palettes.ts
├── actions/                    # contact.ts — the one Server Action in the app
└── metadata.ts                  # siteConfig, pageMetadata, generatePageMetadata/generateBlogPostMetadata/generateProjectMetadata
```

**Assessment: enterprise-standard, and the strongest-organized part of the codebase.** The `lib/data/<page>.ts` ↔ `lib/utils/sheets/<page>.ts` 1:1 mirroring (documented in `data-architecture.md`) is exactly the kind of predictable, mechanical pattern that makes onboarding fast — a new page always means the same two files plus a `page.tsx`. `lib/utils/sheets/index.ts` is the only barrel export in the codebase; it exists specifically so `scripts/migrate-sheet-schema.ts` and the CSV export scripts can import every fetcher's column-contract constant from one place rather than five.

**No top-level `types/` or `styles/` folder exists — this is a deliberate, correct choice, not a gap.** Types live next to the data they describe (`lib/data/shared-types.ts`, plus per-domain types like `Project`/`BaseProject` in `projects-page.ts`) rather than in a project-wide `types/` dump — this keeps a type next to its one real consumer instead of forcing every change to touch two files in two folders. Styling lives in `app/globals.css` (Tailwind v4's CSS-first config) plus Tailwind utility classes inline — there is no component-level CSS to warrant a `styles/` folder. **Recommendation, not applied:** if the project grows to the point where types are shared across more than 2–3 unrelated domains (e.g., a type needed by both `lib/data/` and an eventual `lib/api/` layer), that's the trigger to introduce a top-level `types/` folder — not before.

## 5. `hooks/` — currently empty

Contains only `.gitkeep`. `hooks/useScrollReveal.ts` (an IntersectionObserver-based scroll-reveal hook, fully superseded by the GSAP `ScrollTrigger` effects in `lib/animations/gsap-animations.ts`) was removed in this pass — it had zero imports anywhere. The empty folder is kept as scaffolding for the next real custom hook, matching the `.gitkeep` convention already used here and in `lib/`.

## 6. `public/` — static assets

```
public/
├── images/
│   ├── blog/, projects/, project-thumbnails/, services/, team/, testimonials/
├── icons/
│   ├── arrow-right.svg
│   └── icons.tsx           # Inline SVG icon components (distinct from lucide-react)
├── bg-video.mp4              # Hero background video
├── short.mp4                  # Project showcase video
└── bg-footer.webp             # Footer background image
```

**Assessment: enterprise-standard.** Images are organized by content type, matching the `lib/data/` page split — easy to find "which folder has the team photos." No action needed.

## 7. `scripts/` — dev-time tooling

```
scripts/
├── export-home-csv.ts, export-about-csv.ts, export-service-csv.ts, export-blog-csv.ts, export-projects-csv.ts
└── migrate-sheet-schema.ts
```

**Assessment: enterprise-standard.** Clearly separated from the app itself (never imported by `app/`, `components/`, or `lib/` at runtime), run via `npx tsx scripts/<name>.ts`. See [`google-sheet-schema.md`](./google-sheet-schema.md) for what each one does.

## 8. Dead code removed this pass

17 files removed in total — the first 8 were already identified in earlier audit rounds (empty stub files, one unused hook); the other 9 were found during this phase's deeper folder-by-folder sweep:

| File | Why it was dead |
|---|---|
| `lib/site.ts`, `lib/fonts.ts`, `lib/icons.ts` | Empty files (0 bytes) |
| `lib/animations/reveal.ts`, `hero.ts`, `description.ts` | Empty files (0 bytes) |
| `hooks/useScrollReveal.ts` | Superseded by GSAP ScrollTrigger effects; zero imports |
| `components/sections/ProcessSection.tsx` | Zero imports anywhere |
| `components/sections/IntegrationSection.tsx`, `WhatWeDo.tsx`, `TrustedSection.tsx` | **Not real components** — literal placeholder stubs (`export default function HeroSection() { return <div>HeroSection</div> }`), copy-pasted junk from early scaffolding, matching section names in the stale pre-rewrite README |
| `components/layout/Container.tsx` | Real, working component; zero imports — every section uses an inline `mx-auto max-w-400 px-5 sm:px-8` pattern instead |
| `components/layout/SectionTitle.tsx`, `components/shared/SectionHeading.tsx` | Two separate abandoned "badge + heading" component drafts, both superseded by `SectionBadge` + inline heading markup, which is what every real section actually uses |
| `components/cards/GlassCard.tsx` | Zero imports |
| `components/shared/MotionWrapper.tsx` | Framer-Motion wrapper, superseded by the GSAP effects system; zero imports |
| `components/shared/ImageWithFallback.tsx` | Zero imports — Sheets-sourced image URLs are handled inline where needed instead |

Verified via `tsc --noEmit`, `next lint`, and a full `next build` after every deletion — all clean, zero broken references.
