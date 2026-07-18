# Brain Stack — Coding Guidelines

**Purpose:** codify the conventions this codebase already follows almost universally, so they survive contact with a larger team instead of remaining tribal knowledge. Nothing in this document requires changing existing code — it documents the standard already in place and flags the few deviations found.

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

## Import conventions

- **Path alias:** use `@/*` (mapped to project root in `tsconfig.json`) for all cross-folder imports. Only same-directory or one-level-down relative imports (`./`, `../`) are acceptable, and even those should be rare.
- **One confirmed deviation:** `components/animations/Loader.tsx` imports `Logo` via `import { Logo } from '../common/Logo'` — relative path, single quotes — the only file of its kind found across 72 `.tsx` files. Fix opportunistically next time that file is touched; not worth a standalone commit.
- **Quote style:** double quotes throughout (enforced implicitly by Prettier defaults + `prettier-plugin-tailwindcss`). The `Loader.tsx` deviation above is again the only exception found.
- **Import order:** not currently enforced by an ESLint rule. Observed convention is alphabetical-by-source (external packages, then `@/` imports, then relative), but this is convention, not tooling — see the roadmap for adding `eslint-plugin-import`'s `order` rule once the team grows past 1–2 people, so this stops being tribal knowledge.

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
- Every repeating body uses `items: T[]` unless the name would be genuinely ambiguous (`projects`, `posts` are fine since they're the whole page's subject).
- Check `lib/data/shared-types.ts` before defining a new inline shape — if what you're building is a process step, a feature card, or a service tile, a shared type is either already there or proposed in `data-architecture.md` §5 for exactly this purpose.
- Every data file exports its types as `export type X = typeof xData` immediately after the const, mirroring the existing pattern in every `lib/data/*.ts` file.

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
