# Brain Stack — Component Guidelines

**Scope:** how to categorize, structure, and write a new component in this codebase, and how to decide whether one is even needed. Complements [`coding-guidelines.md`](./coding-guidelines.md) (naming/import conventions) and [`folder-structure.md`](./folder-structure.md) (where things live).

---

## 1. Where does a new component go?

Ask these in order:

1. **Is it a full page section** (a top-level block composed directly in a `page.tsx`, receiving Sheets-sourced data as props)? → `components/sections/`. This is by far the largest category (24 files) and the default answer for "I'm building a new part of a page."
2. **Is it a generic interactive primitive with no page-specific content** (a button variant, a badge, a toggle)? → `components/buttons/` or `components/common/`, depending on whether it's specifically a clickable action (`buttons/`) or a smaller UI atom (`common/`).
3. **Is it purely about motion/interaction, with no real content of its own** (a cursor follower, a parallax wrapper, a magnetic-hover effect)? → `components/animations/`.
4. **Is it App Router chrome** (nav, footer, the persistent scroll/theme machinery)? → `components/layout/`.
5. **Is it a shadcn/ui primitive**, installed or hand-rolled to match that library's API? → `components/ui/`. Don't hand-edit these to add app-specific behavior — wrap them instead (see `SecondaryButton.tsx` wrapping `ui/button.tsx`).
6. **Everything else that's genuinely reusable across unrelated sections** → `components/shared/`. Keep this folder small and be honest about "genuinely reusable" — see §5 on when *not* to add here.

## 2. The standard section component

Every section in `components/sections/` follows one shape. This is the template to copy for a new one — see `coding-guidelines.md` §"Component structure convention" for the annotated version with import-order rules:

```tsx
"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { XData } from "@/lib/data/x-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface XSectionProps {
  data: XData
}

export default function XSection({ data }: XSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.effects.fadeUpOnScroll(...)
  }, { scope: sectionRef })

  return <section ref={sectionRef}>...</section>
}
```

**Non-negotiable rules, because they're what keeps 24 independent files predictable:**
- Props are typed against a `lib/data/<page>.ts` export, never an inline anonymous type.
- The component never fetches its own data — it always arrives as a prop from the parent `page.tsx`.
- `useGSAP` always receives `{ scope: <ref> }`. This is what makes `@gsap/react`'s automatic `gsap.context().revert()` cleanup safe — see `performance-guide.md` §2 for what goes wrong when a component bypasses this with a manual global `ScrollTrigger.getAll().kill()`.
- Default export, name matches the filename exactly (`HeroSection.tsx` exports `HeroSection`).

## 3. Server vs. Client Component

This codebase's split is simple and has zero exceptions:

- **`app/*/page.tsx` and `app/layout.tsx`** are Server Components. They call `lib/utils/sheets/*` fetchers and pass plain data down.
- **Every section, button, and animation component is a Client Component** (`"use client"`), because the interactivity (GSAP, hover states, carousels) requires it.
- A **few purely presentational components have no `"use client"`** — check the top of the file before assuming; components with no hooks, no event handlers, and no animation library usage (e.g., simple layout wrappers) don't need it, and adding it unnecessarily grows the client bundle for no reason.

**Decision rule for a new component:** default to Server Component (no directive). Add `"use client"` only when you actually use a hook, an event handler, or a browser-only API — not preemptively.

## 4. Props conventions

- Narrow the prop to what the component actually uses. `AboutStats` takes `stats: AboutStatsData` (the specific slice), not the entire `AboutSheetData`. This keeps a component's dependency surface visible from its signature alone.
- Optional props get a default in the destructuring (`{ showArrow = true }`), not a separate `defaultProps` or conditional inside the body.
- Prefer composition over boolean-flag explosion: `PrimaryButton` branches on whether `href` is present (rendering a `Link` or a `button`) rather than taking five different boolean variant flags — check that pattern before adding a new prop that could instead be inferred from what's already passed.

## 5. When to add a shared component — and when not to

**Add one when:** the same JSX structure with the same styling is about to appear a third time, unchanged. Two occurrences of similar-looking markup is not automatically duplication — see the `ContactMethods` case below.

**Don't add one when:** the "duplication" is actually the same underlying data (already centralized — e.g. `contactData` in `lib/constants/contact.ts`) rendered with *different, intentional* styling per context. This codebase has a real example: the email/phone/address/social-links block appears in `Footer.tsx`, `ContactForm.tsx`, and `SettingsDrawer.tsx` with three different visual treatments (plain links vs. bordered cards vs. muted-background rows, three different icon sizes, three different color-token sets). This was flagged as "duplicate code to extract" in an earlier review pass; on closer inspection during this phase, forcing all three into one shared component would require either changing the visual output in at least two of the three places (out of scope — "no redesign") or building a component with enough variant props that it wouldn't actually be simpler than three plain JSX blocks. **Decision: leave as three separate, simple renderings of the same centralized data.** This is the reference example for the judgment call: *data* duplication is a real problem worth fixing (and here, already fixed — one `contactData` constant); *markup* similarity across genuinely different visual contexts is not automatically the same problem.

**This codebase's history of abandoned "shared component" attempts** is itself instructive — `SectionTitle.tsx`, `SectionHeading.tsx`, `Container.tsx`, `GlassCard.tsx`, and `MotionWrapper.tsx` were all real, working, reasonably-written components that were built, never adopted by more than zero call sites, and removed as dead code in this phase's cleanup (see `folder-structure.md` §8). Each was superseded by a simpler pattern that emerged organically (`SectionBadge` + inline headings instead of a heading component; inline `mx-auto max-w-400 px-5 sm:px-8` instead of a `Container`; GSAP effects instead of a `framer-motion` wrapper). The lesson: don't build the shared abstraction speculatively, ahead of the second or third real usage — build the second/third usage first, then extract if the pattern actually repeats verbatim.

## 6. Animation conventions

Covered in depth in `coding-guidelines.md` and `performance-guide.md` — summarized here for component authors:

- Reuse `gsap.effects.fadeUp` / `fadeUpOnScroll` / `staggerFadeUpOnScroll` / `textRevealOnScroll` from `lib/animations/gsap-animations.ts` before writing a new one-off tween.
- Never call `ScrollTrigger.getAll().kill()` in a cleanup function — it kills every ScrollTrigger on the page, not just the unmounting component's own. `useGSAP`'s automatic scoped revert already handles cleanup correctly when `{ scope: ref }` is passed.
- If a component's canvas/visualization is heavy (three.js, a large chart library), check whether it should be `next/dynamic(..., { ssr: false })`-loaded — see `BrainWireframe.tsx` for the reference implementation.
