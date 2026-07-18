# Brain Stack — Coding Guidelines

**Purpose:** codify the conventions this codebase already follows almost universally, so they survive contact with a larger team instead of remaining tribal knowledge.

> **Implementation update (2026-07-18):** the naming-convention pass in this document has been applied — see the "Fixed" notes inline below and `data-architecture.md` for the data-layer schema normalization this enabled.

---

## Naming conventions (observed and to maintain)

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `HeroSection.tsx`, `ProjectDetails.tsx` |
| Non-component files | camelCase `.ts` | `gsap-animations.ts` uses kebab-case as the one exception — see below |
| Components | PascalCase, matches filename | `export default function HeroSection()` |
| Hooks | camelCase, `use` prefix | `useScrollReveal.ts` |
| Data/constant exports | camelCase, `Data`/`Config` suffix for content objects | `heroBannerData`, `siteConfig` |
| Type exports | PascalCase, matches the data it types | `type HeroBannerData = typeof heroBannerData` |
| Sheets column constants | SCREAMING_SNAKE_CASE, `as const` array | `PROJECTS_SHEET_COLUMNS` |

**Inconsistency found:** `lib/animations/gsap-animations.ts` uses kebab-case where every sibling file (`lenis.ts`, `hero.ts`) uses plain camelCase-compatible names. Not worth renaming retroactively (would touch every importer for no functional gain), but new files in `lib/` should default to the camelCase pattern used elsewhere.

**Fixed 2026-07-18:** `components/sections/VideoSectioni.tsx` (unused, dead component) had a real filename typo — renamed to `VideoSection.tsx` to match its own exported component name. Zero-risk since the file had no importers.

## Import conventions

- **Path alias:** use `@/*` (mapped to project root in `tsconfig.json`) for all cross-folder imports. Only same-directory or one-level-down relative imports (`./`, `../`) are acceptable, and even those should be rare.
- **Fixed 2026-07-18:** six files imported a `components/common/`-or-`components/shared/`-level component via a relative path instead of the `@/` alias (`Loader.tsx`, `EngineeringProcess.tsx`, `ProcessSection.tsx`, `ServiceProcessTimeline.tsx`, `ExclusiveServices.tsx`, `ServicesSection.tsx`) — all switched to the alias and re-sorted into the file's existing alphabetical-by-source import order. `EngineeringProcess.tsx` also had a stray commented-out duplicate import removed.
- **Quote style:** double quotes throughout (enforced implicitly by Prettier defaults + `prettier-plugin-tailwindcss`).
- **Import order:** not currently enforced by an ESLint rule. Observed convention is alphabetical-by-source (external packages, then `@/` imports, then relative), but this is convention, not tooling — worth adding `eslint-plugin-import`'s `order` rule once the team grows past 1–2 people, so this stops being tribal knowledge and the fixes above don't quietly regress.

## Component structure convention

Every section component in `components/sections/` follows this shape, with no exceptions found:

```tsx
"use client"

import { SomeSharedComponent } from "@/components/common/SomeSharedComponent"
import "@/lib/animations/gsap-animations"       // side-effect import registers gsap.effects.*
import type { XData } from "@/lib/data/x-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface XSectionProps {
  data: XData    // or a narrower slice of it, e.g. { spotlight: XSpotlightData }
}

export default function XSection({ data }: XSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.effects.fadeUpOnScroll(...)   // reuse the shared effect, don't hand-write a tween
  }, { scope: sectionRef })            // ALWAYS scope to the component's own ref

  return <section ref={sectionRef}>...</section>
}
```

**Rules to enforce when reviewing new sections:**
1. Props are always typed against a `lib/data/<page>.ts` export — never an inline anonymous object type.
2. `useGSAP` always receives `{ scope: <ref> }` — this is what makes `@gsap/react`'s automatic cleanup safe. The one place this convention breaks down (`AboutSection.tsx`'s manual global `ScrollTrigger.getAll().kill()`) is flagged as an open issue in `architecture-audit.md` §8 precisely because it deviates from this rule.
3. New scroll animations should reuse `gsap.effects.fadeUp`/`fadeUpOnScroll`/`staggerFadeUpOnScroll`/`textRevealOnScroll` from `lib/animations/gsap-animations.ts` rather than writing a new one-off tween — check there first.
4. Section components never fetch data themselves — data always arrives as props from the parent `page.tsx`.

## Data file convention (`lib/data/<page>.ts`)

See [`data-architecture.md`](./data-architecture.md) for the full schema discussion. The mechanical rule to follow for any *new* section, effective immediately:

- Every section header uses `{ badge?, title, description? }` — don't invent a fourth field name for "the eyebrow text above a heading."
- Every repeating body uses `items: T[]` unless the name would be genuinely ambiguous (`projects`, `posts` are fine since they're the whole page's subject). Applied 2026-07-18: `aboutApproachData.steps`→`.items`, `serviceProcessData.steps`→`.items`, `exclusiveServicesData.categories`→`.items`, `whyChooseUsData.points`→`.items`.
- Check `lib/data/shared-types.ts` before defining a new inline shape — `ProcessStep`, `FeatureCard`, `ServiceOffering`, `SectionHeader`, and `FAQItem` are implemented and in active use (see `data-architecture.md` §5) — reach for one of these before inventing a new inline shape for what's likely the same concept.
- Avoid reusing the same word for two different concepts even when the *shape* differs — `aboutMissionData.approach` was renamed to `.pillars` specifically because it collided in name (not meaning) with the top-level `aboutApproachData`.
- Every data file exports its types as `export type X = typeof xData` immediately after the const, mirroring the existing pattern in every `lib/data/*.ts` file.
- **Renaming a field that a live Google Sheet's JSON-blob cell already uses?** Key-value tabs (Home/About/Services) store each section as a JSON blob in one cell — renaming a nested key inside that blob needs the corresponding cell's JSON updated too, or the field silently reverts to its fallback default (see `data-architecture.md` §1's merge-over-fallback behavior). Tabular tabs (Blog/Projects) are a stronger contract — their column headers are literally what a content editor sees and types into — treat those column names (`PROJECTS_SHEET_COLUMNS`, `BLOG_SHEET_COLUMNS`) as effectively frozen; reshape the *type layer* instead (see the `Project`→`BaseProject`/`PortfolioProject`/`CaseStudyProject` split in `data-architecture.md` §6 for how to do this without touching a single column name).

## Discriminated-union convention for "content with two depths"

`Project` (`lib/data/projects-page.ts`) is the reference implementation for a recurring shape: content where every item shares a common core, but a subset of items also carry a much deeper write-up. Rather than one interface with the deep fields all typed nullable/optional (which was the original `Project` design — see `data-architecture.md` §6 for what that cost), use:

```ts
interface BaseX { /* fields every item has */ }
interface XSummary extends BaseX { kind: "summary" }
interface XDetailed extends BaseX { kind: "detailed"; /* deep fields, all required */ }
type X = XSummary | XDetailed
```

Consumers narrow once — `const detailed = item.kind === "detailed" ? item : null` — rather than checking `.length > 0` on every deep field individually. If Blog posts, team member profiles, or any other content type grows a similar "some entries get a full write-up, others don't" need, follow this pattern rather than adding another all-optional field to an existing interface.

## File organization thresholds

| Folder | Current count | Reorganize when |
|---|---|---|
| `components/sections/` | 27 | Passes ~40 — split into `sections/home/`, `sections/about/`, etc. |
| `lib/data/` | 5 | Passes ~10 pages — consider a `lib/data/index.ts` barrel if imports get unwieldy |
| Any single `lib/data/<page>.ts` file | Up to ~250 lines currently | Passes ~400 lines — split by section into `lib/data/<page>/<section>.ts` |

## Dead code policy

Three empty files (`lib/site.ts`, `lib/fonts.ts`, `lib/icons.ts`), three empty animation files (`lib/animations/reveal.ts`, `hero.ts`, `description.ts`), one unused hook (`hooks/useScrollReveal.ts`), and several unused exports in `lib/metadata.ts` were found by manual reading, not tooling — see `architecture-audit.md` §3 for the full inventory. Recommendation: add `ts-prune` (or equivalent) to CI once headcount grows past 1–2 developers, so files like these are caught automatically instead of accumulating silently until the next full manual audit.

## Comment style already in use — keep it

The codebase's existing comments are almost universally the good kind: they explain *why*, not *what* (e.g., the JSDoc above `parseJsonObject` in `lib/utils/sheets/shared.ts` explaining the merge-over-fallback rationale, or the reduced-motion reasoning threaded through `BrainWireframe.tsx`). Continue this standard for new code — a comment justified by "this would surprise a future reader" rather than restating the code.
