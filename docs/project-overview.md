# Brain Stack — Project Overview

**Purpose of this document:** onboard a new developer to the codebase in one read. For scores, audits, and roadmap items, see [`architecture-audit.md`](./architecture-audit.md).

---

## What this is

Brain Stack is a Next.js (App Router) marketing/agency site: 7 routes, content sourced from Google Sheets with typed local fallbacks, GSAP-driven scroll animations, and a React Three Fiber decorative visualization on the About page.

## Request-to-pixels flow

```mermaid
flowchart TD
    A["Browser request: e.g. /projects/sync-space"] --> B["app/layout.tsx — Server Component"]
    B --> C["Sora + Inter fonts (next/font/google)"]
    B --> D["ThemeProvider (next-themes, class strategy)"]
    D --> E["Loader / Cursor / ScrollButton — always-on client widgets"]
    D --> F["SmoothScroll — Lenis + GSAP ScrollTrigger bridge"]
    F --> G["Navbar + page content + Footer"]
    G --> H["app/projects/[slug]/page.tsx — async Server Component"]
    H --> I["getProjects() — lib/utils/sheets/projects.ts"]
    I --> J{"Sheets env vars set + fetch OK?"}
    J -- no --> K["projectsData.projects — lib/data/projects-page.ts"]
    J -- yes --> L["Google Sheets 'Projects' tab, row-mapped"]
    K --> M["ProjectDetails section (props-only, 'use client' for GSAP)"]
    L --> M
    M --> N["Rendered HTML — pre-built via generateStaticParams, revalidated every 300s"]
```

**Step by step:**

1. **`app/layout.tsx`** (Server Component) is the one place fonts, theme, and the always-on decorative widgets (`Loader`, `Cursor`, `ScrollButton`, `SmoothScroll`) are wired. `MobileNav` renders outside `SmoothScroll` deliberately, so it stays `position: fixed` and unaffected by Lenis's transform-based scroll.
2. **`SmoothScroll`** instantiates Lenis, bridges its `scroll` event to `ScrollTrigger.update`, and drives both off `gsap.ticker` — bailing out entirely under `prefers-reduced-motion`.
3. **Every `page.tsx`** is an `async` Server Component. It calls one or more `get*Data()` functions from `lib/utils/sheets/*`, then passes plain data down as props — there is no client-side data fetching anywhere on the happy path.
4. **Section components** are `"use client"` because they need `useGSAP`/`useFrame`, but they only ever receive pre-fetched data as props. Server Components own data; Client Components own interaction/animation. This split is 100% consistent across all 27 sections.
5. **`export const revalidate = 300`** on every data-driven page makes every route ISR with a 5-minute cache — Sheet edits appear within 5 minutes without a redeploy.

## Folder map

```
app/                    Routes only — composes sections, no business logic
  about/, blog/[slug]/, blog/, contact/, projects/[slug]/, projects/, services/
  layout.tsx  page.tsx  globals.css  not-found.tsx

components/
  sections/             27 files — one per page section, not reused cross-route
  layout/                Navbar, Footer, MobileNav, SmoothScroll, SettingsDrawer, Container
  buttons/  cards/       Small reusable primitives
  common/                Logo, ThemeToggle, SectionBadge, ColorPaletteSwitcher, ScrollButton
  animations/            Cursor, Loader, MagneticButton, ParallaxImage, DiagonalPattern
  shared/                ImageWithFallback, MotionWrapper, SectionHeading, marquee
  three/                 BrainWireframe (React Three Fiber)
  theme/  ui/            next-themes wrapper; shadcn primitives (button, carousel, drawer)

hooks/                  useScrollReveal.ts (currently dead — see architecture-audit.md §3)

lib/
  data/                  Typed seed/fallback content, one file per page + shared-types.ts
  utils/sheets/          Google Sheets fetch + parse layer, mirrors lib/data/ 1:1
  animations/            gsap-animations.ts (real) + lenis.ts (real) + 3 empty files
  constants/             navigation, footer, contact, color-palettes
  metadata.ts            SEO metadata — partially wired, see seo-strategy.md
  utils/cn.ts  utils/icons.ts  utils/format-date.ts  utils/reading-time.ts

scripts/                CSV export + one-time Sheets schema migration (dev-time only)
public/images/          blog/  projects/  project-thumbnails/  services/  team/  testimonials/
docs/                   This documentation set
```

## The "add a new page" pattern

This is the pattern every one of the 7 routes follows, mechanically, with zero exceptions:

1. Define the page's data shape(s) in `lib/data/<page>.ts` — typed seed data + exported `type X = typeof xData`.
2. Add a matching fetcher in `lib/utils/sheets/<page>.ts` — read the Sheet tab, parse each section with `parseJson`/`parseJsonObject` from `lib/utils/sheets/shared.ts`, fall back to step 1's seed data on any failure.
3. Create `app/<page>/page.tsx` as an `async` Server Component: call the fetcher(s), pass the result into section components as props.
4. Build section components in `components/sections/` — `"use client"`, typed against the `lib/data` interfaces, animated with the shared `gsap.effects.*` helpers from `lib/animations/gsap-animations.ts`.
5. Set `export const revalidate = 300` on the page.

Follow this exact sequence for any new page — see [`data-architecture.md`](./data-architecture.md) for the Sheets-side details and [`coding-guidelines.md`](./coding-guidelines.md) for naming conventions to use in step 1.

## Where to look for what

| Question | Look here |
|---|---|
| "Why does this page show stale content?" | `revalidate = 300` on the page — ISR window, not a bug |
| "Where does X page's copy come from?" | `lib/data/<page>.ts` (fallback) or the Google Sheet tab named after the page (live) |
| "How do I add a scroll-reveal animation?" | `gsap.effects.fadeUp`/`fadeUpOnScroll`/`staggerFadeUpOnScroll`/`textRevealOnScroll` in `lib/animations/gsap-animations.ts` — don't write a new tween from scratch |
| "Why is this file empty?" | See the dead-file inventory in `architecture-audit.md` §3 — several `lib/*.ts` files are legacy no-ops |
| "How do SEO tags get set?" | Currently only in `app/layout.tsx` (site-wide default) — see `seo-strategy.md` for the fix in progress |
