# Brain Stack — Rendering Strategy Decision Document

**Scope:** the rendering strategy for every route, and why. See [`architecture-audit.md` §5](./architecture-audit.md#5-rendering-strategy) for the summary table this document expands on.

> **Production-hardening update (2026-07-18):** `app/loading.tsx` and `app/error.tsx` are now implemented (see §"Loading & error boundaries" below and [`performance-guide.md`](./performance-guide.md) §3–4). The `generateStaticParams` bounding question (§"`/projects/[slug]`" and "`/blog/[slug]`" below) was re-evaluated during this pass and **deliberately left unbounded** — see the updated reasoning inline.

---

## Decision framework used

For each route, three questions decide the strategy:

1. **Does the content differ per request/user?** (auth, personalization, cookies) — if yes, SSR/dynamic is required. Nowhere in this app is the answer yes.
2. **Does the content change without a code deploy?** (via Google Sheets) — if yes, pure SSG (build-time only) is wrong; ISR is needed.
3. **Is the URL space bounded and known at build time, or unbounded?** — bounded + known → `generateStaticParams`; unbounded/growing → bounded `generateStaticParams` + `dynamicParams: true` fallback.

Every route in this app answers "no" to (1) and "yes" to (2), which is exactly the profile ISR is designed for.

## Per-route decisions

### `/` (Home)
- **Current:** ISR, `revalidate = 300`. Server Component fetches `home`, `about`, `projects`, `posts` via `Promise.all`.
- **Decision: keep.** Four parallel Sheets reads, all marketing content that changes on a "someone edited a spreadsheet" cadence, not a per-request cadence. A 5-minute staleness window is appropriate.

### `/about`
- **Current:** ISR, `revalidate = 300`.
- **Decision: keep.** Same profile as Home — mission/team/stats content.

### `/services`
- **Current:** ISR, `revalidate = 300`.
- **Decision: keep.** Static-ish service catalog; no reason to serve fresher than 5 minutes.

### `/projects` (index/grid)
- **Current:** ISR, `revalidate = 300`.
- **Decision: keep at current scale.** Re-evaluate once the Projects sheet passes ~150 rows — at that point, consider whether the grid needs pagination (a UX decision, not just a rendering one) since ISR doesn't change how much data the client downloads on one request.

### `/projects/[slug]` (case study / portfolio detail)
- **Current:** SSG via `generateStaticParams` (all slugs) + ISR revalidation.
- **Decision: keep the pattern; bounding remains deferred, not applied.** This is the textbook-correct pattern for content that's read far more often than it's written. `generateStaticParams` currently returns *every* slug (10 today), meaning every deploy rebuilds every project page — cheap at this count. **Re-evaluated 2026-07-18 and deliberately left unbounded**: bounding to a "recent N" subset only does something once `N` is smaller than the total slug count; with 10 projects, any reasonable `N` would just be "all of them" with extra code to say so. Revisit once the Projects sheet passes roughly 100–150 rows — at that point bound to the most recent/most-linked N and rely on `dynamicParams` (default `true`) to render the long tail on first request, ISR-cached identically to the pre-built pages afterward.

### `/blog` (index)
- **Current:** ISR, `revalidate = 300`.
- **Decision: keep.**

### `/blog/[slug]`
- **Current:** SSG via `generateStaticParams` + ISR.
- **Decision: keep the pattern; same "deferred, not applied" bounding status as `/projects/[slug]`** — 12 posts today, same reasoning.

### `/contact`
- **Current:** Fully static — no data fetch, no `revalidate` export.
- **Decision: keep.** This is already the optimal rendering choice. As of 2026-07-18 the page has a working Server Action with server-side validation and honeypot spam protection (`lib/actions/contact.ts`) — delivery (email/storage) is still a documented `TODO` pending a provider decision, but that's a functional gap, not a rendering one. The page still doesn't need to become dynamic — the mutation happens via the Action, not via a change to how the page renders.

## Loading & error boundaries

Two files added 2026-07-18, both root-level (covering every route via the App Router's segment inheritance — no per-route duplicates needed at this route count):

- **`app/loading.tsx`** — a plain Server Component (no client JS added to any route's bundle), shown automatically by the App Router's Suspense boundary while a route segment's server data is resolving. In practice this mostly matters on an ISR cache miss — most navigations hit the 300s cache and never show it.
- **`app/error.tsx`** — a Client Component (required by Next's error-boundary contract), catches unexpected exceptions in any route segment and offers "Try Again" (`reset()`) and "Back to Home", styled consistently with the pre-existing `not-found.tsx`. Previously, an uncaught exception anywhere in the app fell through to Next's default, unbranded error page.

See [`performance-guide.md`](./performance-guide.md) §3–4 for the full reasoning and verification notes.

## What this app correctly does NOT use

| Feature | Why it's correctly absent |
|---|---|
| `force-dynamic` / SSR | No per-request personalization, cookies, or auth anywhere in the app |
| Client-side data fetching (SWR/React Query) | All data is resolved server-side before render; nothing needs to refetch without a navigation |
| Parallel/Intercepting routes | No modal-over-route or multi-slot UI pattern exists |
| Route Groups | Only 7 flat routes — grouping would add indirection without benefit at this size |

## Summary table

| Route | Strategy | Data source | Cache window |
|---|---|---|---|
| `/` | ISR | 4× Sheets fetch (parallel) | 300s |
| `/about` | ISR | 1× Sheets fetch | 300s |
| `/services` | ISR | 2× Sheets fetch (parallel) | 300s |
| `/projects` | ISR | 2× Sheets fetch (parallel) | 300s |
| `/projects/[slug]` | SSG + ISR | 1× Sheets fetch, `generateStaticParams` | 300s post-build |
| `/blog` | ISR | 1× Sheets fetch | 300s |
| `/blog/[slug]` | SSG + ISR | 1× Sheets fetch, `generateStaticParams` | 300s post-build |
| `/contact` | Static | None | N/A |

No route in this application currently needs to change its rendering strategy for correctness. `generateStaticParams` bounding on the two dynamic routes remains a documented future action, deliberately not applied yet at current content volume (10 projects, 12 posts) — see `architecture-audit.md` §14 and `roadmap.md` P3 for the trigger point (~100–150 rows).
