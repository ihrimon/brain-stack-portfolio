# Brain Stack — Production Deployment Checklist

**Purpose:** the concrete, verifiable checklist to run through before flipping this site live or promoting a release. See [`architecture-audit.md` §15](./architecture-audit.md#15-production-checklist) for the architecture-level summary this expands into actionable steps.

**Legend:** ✅ Ready — no action needed · 🟡 Needs Improvement — ship-with-caveats, fix soon · 🔴 Critical — do not launch without this

---

## Environment & configuration

- ✅ `.env.local` correctly gitignored; `.env.example` contains placeholders only — verify with `git status` that no `.env*` file other than `.env.example` is tracked.
- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID` set in the hosting provider's environment variable settings (not committed anywhere).
- [ ] Confirm the production service account has **Viewer** (not Editor) access on the production Google Sheet — the runtime code only requests `spreadsheets.readonly`; granting Editor is unnecessary privilege.
- [ ] Confirm `next.config.ts`'s `images.remotePatterns` covers every image host actually used in production content (currently `res.cloudinary.com`, `i.ibb.co.com`) — add any new host **before** publishing content that references it, or `next/image` will reject the request at runtime.

## SEO — ✅ Done 2026-07-18 (structured data still open)

- [x] Per-page `generateMetadata`/`metadata` exported from all 7 routes (see [`seo-strategy.md`](./seo-strategy.md)).
- [x] `app/sitemap.ts` exists and returns all static + dynamic routes.
- [x] `app/robots.ts` exists and references the sitemap.
- [ ] JSON-LD structured data rendered for blog posts and the organization. *(Still P2 — not implemented.)*
- [x] Verified via the production build output that `/about`, `/services`, `/blog`, `/projects`, and one post/project of each show distinct titles/descriptions/OG images from the home page.

## Contact form — 🟡 Needs Improvement, do not launch until delivery is wired up

- [x] Server Action implemented for form submission (`lib/actions/contact.ts`).
- [x] Server-side validation on all fields (name, email, message) — does not rely on the client `required` attributes alone.
- [x] Basic spam protection in place (honeypot field).
- [ ] **Submission does not yet deliver anywhere** — no email/storage provider has been chosen. Validated submissions are currently logged server-side only. **This must be resolved before launch** — pick a provider (Resend / SMTP / Sheets "Leads" tab) and wire the `TODO(delivery)` in `lib/actions/contact.ts`.
- [x] Error state shown to the user if validation fails (inline per-field errors); pending/success state also implemented via `useActionState`.
- [x] Verified end-to-end with Playwright: empty-submit validation, toggle button state, successful submit with UI reset, no console errors.

## Error handling & resilience — ✅ Ready

- [x] `app/error.tsx` added at the root, styled consistently with the existing `not-found.tsx`, with "Try Again" (`reset()`) and "Back to Home". **Done 2026-07-18.**
- [x] `app/loading.tsx` added at the root — plain Server Component, no client JS. **Done 2026-07-18.**
- [x] Confirm behavior when `GOOGLE_SHEET_ID`/credentials are intentionally removed — verified via `.env.local` (empty in this environment throughout development) that the site correctly falls back to `lib/data/*.ts` seed content; this has been exercised continuously, not just code-reviewed.
- [x] **Retry strategy added 2026-07-18** — `withRetry()` in `lib/utils/sheets/shared.ts` wraps every raw Sheets API call with one retry after a 400ms delay before falling through to the typed fallback.
- [ ] Confirm server logs are actually being collected in production (the Sheets fetchers' `console.warn`/`console.error` calls, plus `app/error.tsx`'s `console.error`, are the only failure signals that exist today — if nothing reads server logs, failures are invisible). *(Infra decision, not a code change — still open.)*

## Performance — ✅ Ready (one follow-up documented)

- [x] `BrainWireframe` converted to `next/dynamic(..., { ssr: false })` in `AboutSection.tsx`. **Done 2026-07-18** — removes `three`/R3F from the home page's server-rendered bundle; verified in a browser that the canvas still renders correctly with zero console errors.
- [x] Run `next build` and confirm it compiles cleanly with the dynamic import in place. **Done** — a full bundle-analyzer pass (`@next/bundle-analyzer` or similar) with a defined First Load JS budget per route is still a good follow-up, but out of scope for this pass (no analyzer tooling installed).
- [ ] Add a `poster` attribute to the `HeroSection` and `ProjectVideoSection` background `<video>` elements. *(Attempted 2026-07-18 — the ffmpeg available in this environment can't decode H.264; see [`performance-guide.md`](./performance-guide.md) §1 for the exact command to run with a proper ffmpeg build.)* `preload="auto"` was added to both as a real, completed interim improvement.
- [x] Confirm above-the-fold images use `priority` where appropriate. **Done 2026-07-18** — added to the first row of `/projects` and `/blog` grids, and fixed a real gap found in `ServiceSpotlight.tsx` (the `/services` page's hero-level image had none).
- [x] Added `blurDataURL` shimmer placeholders to 15+ below-the-fold images (team, testimonials, blog cards, project galleries) — see [`performance-guide.md`](./performance-guide.md) §1.
- [x] Fixed a real bug in 4 components (`AboutSection`, `ProjectVideoSection`, `EngineeringProcess`, `AboutStats`): a global `ScrollTrigger.getAll().kill()` that could kill a sibling component's still-mounted animation under fast navigation. See [`performance-guide.md`](./performance-guide.md) §2.

## Accessibility — ✅ Ready (one documented follow-up)

- [x] Add `aria-pressed` to `ContactForm`'s service/budget toggle buttons. **Done** (Phase 1) — verified via Playwright.
- ✅ Skip-to-content link, landmark roles, and reduced-motion handling verified present across the app — no action needed.
- ✅ Focus visibility re-confirmed as a real (if minimal) baseline — `globals.css` themes the native `:focus-visible` outline color sitewide via `outline-ring/50`, not literally absent as a first glance might suggest.
- [ ] **Color contrast — new finding, documented not fixed.** `text-white/30`/`text-white/40` (24 files, used for captions/labels) likely fall below WCAG AA (4.5:1) for normal-sized text on the dark theme. This is a color-token/design decision, not a code bug — see [`performance-guide.md`](./performance-guide.md) §6 for the approximate contrast ratios per opacity level. Needs a design-aware decision before changing, deliberately not touched during this hardening pass.

## Rendering & caching — ✅ Ready

- ✅ ISR (`revalidate = 300`) set on every data-driven route.
- ✅ `generateStaticParams` present on both dynamic routes.
- ✅ **Re-evaluated 2026-07-18**: bounding `generateStaticParams` to a recent-N subset is deliberately *not* applied yet — at 10 projects / 12 posts, any bound would just mean "all of them" with extra code. Trigger point (documented in [`rendering-strategy.md`](./rendering-strategy.md)): revisit before a push that takes either collection past ~100–150 entries.

## Code quality / dead code — 🟡 Needs Improvement, non-blocking

- [ ] Remove or repurpose: `lib/site.ts`, `lib/fonts.ts`, `lib/icons.ts`, `lib/animations/reveal.ts`, `lib/animations/hero.ts`, `lib/animations/description.ts`, `hooks/useScrollReveal.ts`. *(Still open — out of scope for the production-stability pass.)*
- [x] Fixed 6 stray relative imports (`Loader.tsx` plus 5 more found in the same pass: `EngineeringProcess`, `ProcessSection`, `ServiceProcessTimeline`, `ExclusiveServices`, `ServicesSection`) — done in the architecture-standardization phase, see [`coding-guidelines.md`](./coding-guidelines.md).
- [x] Fixed a real filename typo: `VideoSectioni.tsx` → `VideoSection.tsx` (dead/unused component, zero-risk rename).
- Newly noted, not fixed: `ProcessSection.tsx` is dead code (zero imports anywhere) — found during the GSAP cleanup review; adding to this list rather than fixing now, consistent with "no redesign" scope.

## Type safety & build — ✅ Ready

- [ ] Run `npm run typecheck` (`tsc --noEmit`) clean before every release.
- [ ] Run `npm run lint` clean before every release.
- ✅ `strict: true` in `tsconfig.json`, honored throughout the codebase.

## Security — ✅ Ready

- ✅ No secrets committed; env vars server-only.
- ✅ Sheets read-only scope at runtime.
- [ ] Once the contact form backend is built, confirm rate-limiting/validation is actually active in production (not just implemented) — test with a scripted burst of submissions against staging before launch.

## Final go/no-go

Do not flip production traffic to this site until every 🔴 item above is checked. 🟡 items are acceptable to launch with, provided they're tracked and scheduled (see [`roadmap.md`](./roadmap.md) P2), not silently dropped. This mirrors the verdict in [`architecture-audit.md` §19](./architecture-audit.md#19-production-readiness-verdict).
