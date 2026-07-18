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

## Error handling & resilience — 🟡 Needs Improvement

- [ ] `app/error.tsx` added at minimum at the root, styled consistently with the existing `not-found.tsx`.
- [ ] Confirm behavior when `GOOGLE_SHEET_ID`/credentials are intentionally removed in a staging environment — verify the site falls back to `lib/data/*.ts` seed content instead of breaking (this is already implemented; verify it, don't just trust the code read).
- [ ] Confirm server logs are actually being collected in production (the Sheets fetchers' `console.warn`/`console.error` calls are the only failure signal that exists today — if nothing reads server logs, Sheets failures are invisible).

## Performance — 🟡 Needs Improvement

- [ ] `BrainWireframe` converted to `next/dynamic(..., { ssr: false })` in `AboutSection.tsx` — removes `three`/R3F from the About page's server-rendered bundle.
- [ ] Run `next build` and inspect the output bundle sizes per route — confirm no route exceeds a reasonable First Load JS budget (establish a number with the team; flag anything that stands out).
- [ ] Add a `poster` attribute to the `HeroSection` background `<video>`.
- [ ] Confirm above-the-fold images (hero, first project thumbnails) use `priority` where appropriate.

## Accessibility — ✅ Ready

- [x] Add `aria-pressed` to `ContactForm`'s service/budget toggle buttons. **Done 2026-07-18** while rebuilding the form's Server Action — verified via Playwright that `aria-pressed` correctly toggles `true`/`false` and resets after successful submission.
- ✅ Skip-to-content link, landmark roles, and reduced-motion handling verified present across the app — no action needed.

## Rendering & caching — ✅ Ready

- ✅ ISR (`revalidate = 300`) set on every data-driven route.
- ✅ `generateStaticParams` present on both dynamic routes.
- [ ] Before a major content push (100+ new projects/posts at once), bound `generateStaticParams` to a recent-N subset — see [`rendering-strategy.md`](./rendering-strategy.md) — to keep build times from scaling linearly with content.

## Code quality / dead code — 🟡 Needs Improvement, non-blocking

- [ ] Remove or repurpose: `lib/site.ts`, `lib/fonts.ts`, `lib/icons.ts`, `lib/animations/reveal.ts`, `lib/animations/hero.ts`, `lib/animations/description.ts`, `hooks/useScrollReveal.ts`.
- [ ] Remove the unused `seoMetadata`/`structuredDataScript` block from `lib/metadata.ts` (references the wrong domain, superseded by the wired-up `pageMetadata` system).
- [ ] Fix the single stray relative import in `components/animations/Loader.tsx`.

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
