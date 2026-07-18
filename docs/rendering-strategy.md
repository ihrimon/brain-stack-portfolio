# Brain Stack — Rendering Strategy Decision Document

**Scope:** the rendering strategy for every route, and why. See [`architecture-audit.md` §5](./architecture-audit.md#5-rendering-strategy) for the summary table this document expands on.

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
- **Decision: keep the pattern, change the bound.** This is the textbook-correct pattern for content that's read far more often than it's written. The one change needed before scale: `generateStaticParams` currently returns *every* slug, meaning every deploy rebuilds every project page. Bound it to the most recent/most-linked N (e.g. 100) and rely on `dynamicParams` (default `true`) to render the long tail on first request, which then gets ISR-cached identically to the pre-built pages. This keeps build time roughly constant regardless of how many projects accumulate.

### `/blog` (index)
- **Current:** ISR, `revalidate = 300`.
- **Decision: keep.**

### `/blog/[slug]`
- **Current:** SSG via `generateStaticParams` + ISR.
- **Decision: keep the pattern, same bounding recommendation as `/projects/[slug]`.**

### `/contact`
- **Current:** Fully static — no data fetch, no `revalidate` export.
- **Decision: keep.** This is already the optimal rendering choice; the outstanding gap on this page is functional (no submission backend), not architectural. Once a Server Action is added for form submission, the page itself still doesn't need to become dynamic — the mutation happens via the Action, not via a change to how the page renders.

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

No route in this application currently needs to change its rendering strategy for correctness. The one action item is bounding `generateStaticParams` on the two dynamic routes ahead of heavy content growth — see `architecture-audit.md` §14 and `roadmap.md` P3.
