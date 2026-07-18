# Brain Stack — Performance & Production Hardening Guide

**Scope:** Phase 3 production-hardening pass — images, bundle size, rendering, error handling, performance, and accessibility. See [`architecture-audit.md`](./architecture-audit.md) and [`roadmap.md`](./roadmap.md) for the findings this phase closes out.

**Status:** all changes below are implemented and verified (typecheck, lint, full production build, and a Playwright browser pass across `/`, `/projects`, `/projects/[slug]`, `/blog`, `/services`, and a 404). No UI/visual redesign — every change is either invisible in normal use (bundle splitting, retry logic, blur-up placeholders) or a targeted bug fix (the GSAP cleanup issue, the missing `priority` on `/services`' hero image).

> **2026-07-18 update:** a later maintainability-focused pass removed 17 dead files from the codebase (see [`folder-structure.md`](./folder-structure.md) §8) — none of them were reachable at runtime, so this has no performance effect; noted here only because a couple of the removed files (`MotionWrapper.tsx`, `ImageWithFallback.tsx`) might otherwise look like performance-relevant components to a reader scanning the repo. They weren't — zero imports, confirmed before removal.

---

## 1. Images

**Already strong before this pass:** `next/image` was used consistently everywhere, `sizes` was correctly set on every `fill` image, and above-the-fold hero images (`MissionHero`, `ProjectDetails`' case-study hero, `ServicesSection`'s first service image) already had `priority`.

**What changed:**

| Change | Where | Why |
|---|---|---|
| `blurDataURL` shimmer placeholder | 15+ below-the-fold images: team members, testimonial avatars, blog cards (home + `/blog` + related posts), project grid/marquee cards, project detail gallery, `AgencyBanner` | Next's automatic blur generation only works for local static imports — every image here is a runtime string (local path or remote Sheets URL), so it can't be auto-generated. A single shared 8×8 dark shimmer SVG (`lib/utils/image-placeholder.ts`) avoids a jarring flash on slow connections without needing a per-image generated placeholder. |
| `priority` added | First row of `/projects` grid (`index < 3`), first row of `/blog` listing (`rowIndex === 0`) | These are realistic LCP candidates that had none before. |
| `priority` bug fix | `ServiceSpotlight.tsx` — the `/services` page's hero-level image | Found during this review: the first section rendered on `/services` had no `priority` at all, despite being the page's most likely LCP element. |
| `ParallaxImage` extended | `components/animations/ParallaxImage.tsx` | Added `placeholder`/`blurDataURL` passthrough props so the shared parallax wrapper (used by `ProjectDetails` and `AgencyBanner`) can participate in the same pattern. |
| Video `preload="auto"` | `HeroSection.tsx`, `ProjectVideoSection.tsx` | Both videos autoplay muted; explicit `preload="auto"` makes the eager-load intent explicit rather than relying on browser-default heuristics. |

**Deliberately not done — poster frames for the two hero videos.** A real `poster` attribute (a still frame shown before the video loads) would improve perceived load and is a legitimate recommendation. Generation was attempted using the `ffmpeg` binary bundled with this environment's Playwright install, but that build is a stripped VP8/VP9-only encoder with **no H.264 decode support** — it can't read either `.mp4` file. Rather than ship a fabricated placeholder image, this is left as a follow-up: extract a frame with a full ffmpeg build (`ffmpeg -i bg-video.mp4 -ss 00:00:00.5 -vframes 1 bg-video-poster.jpg`) or export one from whatever tool produced the source video, then add `poster="/bg-video-poster.jpg"` to both `<video>` tags.

## 2. Bundle Optimization

**The one big fix:** `BrainWireframe` (React Three Fiber + `three`) is now loaded via `next/dynamic(..., { ssr: false })` in `AboutSection.tsx`, instead of a static import. This was flagged as the single highest-value bundle fix across all three prior audit rounds and had never been applied. `three`/R3F no longer ships in the home page's server-rendered bundle — the canvas is `aria-hidden`, pointer-driven, and decorative, so there's no SSR content it would have contributed anyway. Verified in a browser: the canvas still mounts and renders correctly, zero console errors, no layout shift (the wrapping div is already sized via `aspect-square`, so a loading fallback wasn't needed).

**A second class of fix found while in this territory:** five components had a **global `ScrollTrigger.getAll().forEach(t => t.kill())`** in their `useGSAP` cleanup — `AboutSection`, `ProjectVideoSection`, `EngineeringProcess`, `AboutStats`, and the already-dead `ProcessSection`. This kills *every* ScrollTrigger on the page, not just the unmounting component's own — a latent bug under fast client-side navigation where a still-mounted sibling section's animation could be killed by an unrelated component unmounting. `useGSAP`'s automatic `gsap.context().revert()` (scoped to each component's own ref) already handles this correctly — the manual global kill was redundant and actively risky. Removed from the four live components; left untouched in `ProcessSection.tsx` since that file is dead code (confirmed zero imports anywhere).

**Considered, not applied:**
- **Removing `framer-motion`** in favor of GSAP everywhere (flagged in the first audit as redundant animation libraries). Not applied — `framer-motion` is actively used in `ProjectsGridSection.tsx`'s card-reveal animation and `MotionWrapper.tsx`; removing it would mean rewriting that animation in GSAP, which is a design/behavior change beyond "production stability," not a bundle-splitting exercise.
- **`embla-carousel`** (used by `TeamSection`'s carousel) — moderate size, single usage, lower payoff than `three`/R3F. Not dynamically imported; not worth the added complexity for the marginal gain.

## 3. Rendering

| Item | Status |
|---|---|
| SSG / ISR / Server vs. Client Component split | Unchanged — already correct per `rendering-strategy.md` (re-verified, no issues found) |
| `app/loading.tsx` | **Added.** A plain Server Component, pure-CSS spinner, no client JS — shown by the App Router's automatic Suspense boundary on an ISR cache miss while a route's Sheets fetch resolves. |
| `generateStaticParams` bounding | **Evaluated, not changed.** With 10 projects and 12 blog posts today, bounding to a "recent N" subset is moot — `N` would exceed the total count, so it would add complexity with zero observable effect. The trigger point (documented in `rendering-strategy.md`) is unchanged: revisit once either collection passes roughly 100–150 entries. |

## 4. Error Handling

| Item | Status |
|---|---|
| `app/error.tsx` | **Added.** Client Component (required by Next's error-boundary contract), styled consistently with the existing `not-found.tsx` — same badge/heading/description pattern, a "Try Again" button wired to the boundary's `reset()`, and a "Back to Home" link. |
| `app/loading.tsx` | Added — see §3. |
| `app/not-found.tsx` | Unchanged — already existed and was already good; re-verified it still renders correctly. |
| Google Sheets fetch errors | Unchanged behavior (try/catch → typed fallback), but see retry strategy below. |
| **Retry strategy** | **Added.** A new `withRetry()` helper in `lib/utils/sheets/shared.ts` wraps every raw Sheets API call (`fetchKeyValueTab` for Home/About/Services, plus the direct `values.get()` calls in `blog.ts` and `projects.ts`) — one retry after a 400ms delay on failure, then falls through to the existing typed-fallback behavior if the retry also fails. Covers the common case of a transient network blip or momentary rate limit without turning a genuine outage into a slow one (one retry, not a loop). |
| **Logging** | `app/error.tsx` logs the caught error via `console.error` on mount — the one place a real error-tracking service (Sentry, etc.) would hook in if one gets added later. Sheets fetch logging (`console.warn`/`console.error`) is unchanged; still no alerting on these, which remains a known gap (see `architecture-audit.md` §16). |

## 5. Performance

| Area | Finding / Action |
|---|---|
| **Fonts** | Already optimal — `next/font/google` (Sora, Inter), self-hosted, zero CLS. No action. |
| **Videos** | `preload="auto"` added (§1); poster frames documented as a follow-up (§1). |
| **Images** | Blur placeholders + priority fixes (§1). |
| **Animations** | Fixed the 4-file global `ScrollTrigger.kill()` bug (§2) — a real memory/correctness issue, not just a style nit. Everything else GSAP-related was already strong (scoped `useGSAP` cleanup, `gsap.quickTo` for high-frequency cursor tweens, reduced-motion checks independently in four components). |
| **Hydration** | No mismatch risks found — re-confirmed `ColorPaletteSwitcher` (`useSyncExternalStore` + correct `getServerSnapshot`) and `BrainWireframe` (lazy-initializer state reads guarded by `typeof window`) are both still textbook-correct. |
| **CLS** | No layout-shift risk found — every image has explicit dimensions or a sized wrapper, fonts have zero CLS by construction, videos are absolutely positioned within pre-sized containers. |
| **LCP** | Addressed directly via the priority fixes in §1 (especially the `ServiceSpotlight.tsx` bug) and the bundle-size reduction in §2 (less JS competing for the main thread during initial paint). |
| **INP** | No blocking interaction handlers found — the contact form's Server Action is already async with proper pending state (from Phase 1); GSAP's `quickTo` keeps the cursor's per-frame work cheap. |
| **Memory** | The GSAP cleanup fix (§2) is the concrete memory-leak-adjacent fix here — a killed-by-a-different-component ScrollTrigger doesn't leak memory per se, but the fix also removes the inverse risk of a component's *own* triggers never being cleaned up if the global kill call itself ever threw. |
| **Re-renders** | No new issues found; unchanged from prior audits. |

## 6. Accessibility

No visual/CSS changes were made this phase — see the framing at the top of this document. Findings:

- **Already strong, re-confirmed:** skip-to-content link, landmark roles (`banner`/`navigation`/`menubar`/`contentinfo`/`main`), `aria-label`s on icon-only controls, and `prefers-reduced-motion` checked independently in four separate components.
- **Focus visibility — better than previously characterized.** `app/globals.css`'s base layer applies `outline-ring/50` to every element (`* { @apply border-border outline-ring/50; }`), which themes the browser's native `:focus-visible` outline color sitewide rather than leaving it at browser-default blue. This is a real, if minimal, accessible-by-default baseline — not "missing," as it might first appear from a quick scan. It could still be *enhanced* with explicit offset/width on custom interactive elements (e.g., the Navbar hamburger button), but there is a working baseline today.
- **New finding — color contrast risk.** `text-white/30` and `text-white/40` are used across 24 files for captions, tags, and secondary labels on the dark theme. Approximate contrast against the `#0b0b0f` background:
  - `white/70`, `white/60`: ~6–9:1 — comfortably passes WCAG AA (4.5:1) for normal text.
  - `white/50`: ~4.3–4.5:1 — right at the AA boundary, borderline.
  - `white/40`: ~3.2:1 — **likely fails** AA for normal-sized text (passes only the 3:1 "large text" threshold).
  - `white/30`: ~2.2:1 — **fails** AA even for large text in most cases.
  
  This is a color-token decision, not a bug — fixing it means either raising the opacity floor for body-sized secondary text or introducing a separate, more-opaque token for anything below ~16px. Flagging for a design-aware follow-up rather than silently changing brand colors mid-hardening-pass.

**Not changed:** any color token, spacing, layout, or component visual design — consistent with this phase's "do not redesign" instruction.
