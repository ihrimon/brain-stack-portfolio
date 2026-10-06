# Brain Stack — Premium Redesign Proposal

**Date:** 2026-10-05
**Branch reviewed:** `refactoring` (working tree, including uncommitted changes)
**References:** [x.ai](https://x.ai/) · [grainient.supply](https://grainient.supply/) · [co.design](https://co.design/) · [cuberto.com](https://cuberto.com/)

---

## সারসংক্ষেপ (Summary)

চারটা রেফারেন্স সাইট দেখতে আলাদা। তবু একই কয়েকটা নিয়ম তাদের সবাইকে premium বানায়:

1. **রং কম, আত্মবিশ্বাস বেশি।** প্রায় পুরোটাই কালো/সাদা (বা warm off-white)। accent রং সর্বোচ্চ একটা। Grainient-এ শুধু lime `#C2F13C`, co.design-এ `#F1EEEB` paper আর `#121212` ink।
2. **টাইপোগ্রাফিই আসল ডিজাইন।** বিশাল headline, টাইট letter-spacing, ছোট mono/uppercase label (x.ai-তে Geist Mono, co.design-এ PP Object + Haas Grotesk)।
3. **কাজ দেখায়, কথা কম বলে।** Cuberto আর co.design-এ case study থাকে full-width image/video হিসেবে, hover করলে ভিডিও preview চলে।
4. **Animation সূক্ষ্ম আর সব জায়গায় একই রকম।** একটাই easing curve (x.ai: `cubic-bezier(0.22,1,0.36,1)`), text line-reveal, magnetic button, custom cursor। চোখে পড়ার মতো “effect” নেই।
5. **Social proof সামনে।** client logo, award, “15+ years / 300+ projects”, FAQ।

**Brain Stack-এর বর্তমান অবস্থা:** কোডের মান ভালো। reduced-motion, off-screen pause, dynamic import সব খেয়াল রাখা হয়েছে। কিন্তু ডিজাইন খুব **ভারী আর generic**:

- দুইটা WebGL scene আছে (three.js + R3F + drei)। একটা hero/CTA blob, আরেকটা ৭৫৩ লাইনের BrainWireframe।
- তিনটা animation library একসাথে চলছে (GSAP + framer-motion + Lenis)।
- প্রতিটা নতুন session-এ ১.৪ সেকেন্ডের Loader প্রথম paint আটকে রাখে।
- indigo/violet/cyan gradient palette, তার সাথে ৬টা palette switcher। এতে brand identity দুর্বল হয়ে যায়।
- Sora + Inter একদম সাধারণ AI-template look দেয়।
- `public/`-এ প্রায় ১০MB-এর অব্যবহৃত PNG পড়ে আছে।
- Hero stats (“5+ products, 2 founders”) বড় client-দের সামনে ছোট দেখায়।

**মূল সুপারিশ:** একটা **“Monochrome Editorial + One Signal Color”** ডিজাইন সিস্টেম।

- Paper আর ink রং, শুধু একটা accent।
- Geist + Geist Mono টাইপোগ্রাফি।
- three.js পুরো বাদ। তার জায়গায় একটা ছোট (≈2KB) gradient shader অথবা শুধু CSS mesh gradient।
- framer-motion আর Loader বাদ। শুধু GSAP + Lenis থাকবে।
- Case study হবে বড় media আর hover video দিয়ে।
- Palette switcher সরিয়ে শুধু dark/light রাখা।

লক্ষ্য: **initial JS অনেক কমবে, LCP < 1.8s হবে, আর লুক হবে x.ai/Cuberto লেভেলের**। নিচে ধাপে ধাপে বিস্তারিত দেওয়া আছে।

---

## 1. Reference analysis

> Method: I pulled each site's live HTML and CSS and read fonts, colors, class tokens and section structure from the source. x.ai blocked rendered fetching, so its findings come from raw markup. I didn't watch the animations live, so check the motion notes below in a browser before relying on them.

### 1.1 x.ai — "Restraint at scale"

| Aspect | Observation |
|---|---|
| Stack | Next.js + Tailwind (same as ours) |
| Color | Near-black background, white ink, primary used only as `bg-primary/[0.04]`–`/[0.08]` tints. Almost no saturated color. |
| Type | Geist sans + **Geist Mono** for labels and code. Lots of `text-[13px]`, `text-[10.5px]`, `font-medium`, `tracking-tight`. Headline is split word-by-word for a staggered reveal. |
| Layout | Big hero line ("Frontier AI models for everything you build") → 2 CTAs → **live product UI mockups** (chat, terminal, agent run) instead of stock imagery → stats row (`1M+`, `<200ms`, `5+`) → code sample. |
| Motion | One easing everywhere: `cubic-bezier(0.22,1,0.36,1)`. Durations on a fixed scale: 150 / 300 / 500 / 700 ms. Product mockups "type" themselves. |
| Takeaway for us | **Show the product, not decoration.** A terminal or "build log" mockup of a Brain Stack project says "engineers, not AI generators" far better than 3D blobs. |

### 1.2 grainient.supply — "Texture as brand"

| Aspect | Observation |
|---|---|
| Stack | Framer, Inter |
| Color | `#F0F0F0` / `#141414` neutrals + **one** signal accent `#C2F13C` (lime). Gradients live *inside* content cards, not behind the whole page. |
| Texture | Grainy noise over gradients: the "film" look that reads expensive. |
| Layout | Hero → category grid → carousel → feature grid → testimonials → pricing. Very modular, card-based. |
| Takeaway for us | **Grain + a single accent** gives instant premium feel for almost zero bytes (an inline SVG `feTurbulence` or a 2KB tiled PNG). |

### 1.3 co.design — "Editorial luxury"

| Aspect | Observation |
|---|---|
| Fonts | **PP Object Sans** (display) + **Haas Grotesk** (text) |
| Color | Warm paper `#F1EEEB`, ink `#121212` / `#06080F`, stone `#E0DBD6`. Color comes from *photography*, not UI. |
| Layout | Large case-study tiles (image + project name + client) → **numbered services list** → client logos → awards carousel → closing CTA → locations. |
| Takeaway for us | **Warm off-white instead of pure white** for light mode, plus a numbered, list-style services section (`01 — Product Engineering`) instead of icon cards. |

### 1.4 cuberto.com — "Interaction craft"

| Aspect | Observation |
|---|---|
| Stack | Astro + GSAP, ~43 `<video>` references, custom `cursor-icon` system |
| Layout | Hero → 5 service cards → client logo grid → portfolio → testimonials → "Why Cuberto" (`15+ years`, `300+ projects`, awards) → insights → **FAQ** → huge CTA footer |
| Motion | Signature **cursor follower** that morphs into labels ("View", "Play"), **magnetic buttons**, hover-to-play project videos, smooth page transitions. |
| Takeaway for us | We already have a `Cursor` with `data-cursor="view"`. Lean into it on case studies with **muted, looping, lazy hover videos**. That's where Cuberto's premium feel comes from. |

### 1.5 Shared rules we should adopt

1. **2 neutrals + 1 accent.** Never a multi-stop brand gradient as the main identity.
2. **Display type at 80–160px** on desktop, tight tracking (`-0.03em` to `-0.05em`), sentence case.
3. **Mono micro-labels** (`[01]`, `SERVICES`, `2026`) as the "system" layer.
4. **Hairline grid** (1px borders at 8–10% opacity) for structure instead of cards with shadows.
5. **Real work and real proof** above the fold or right after it.
6. **One motion language:** one ease, one duration scale, reveal on scroll, no bouncing.

---

## 2. Review of the existing Brain Stack code

### 2.1 What's already good (keep)

- Clean data and UI separation (`lib/data/*`), typed content, `generatePageMetadata`, JSON-LD and sitemap. SEO plumbing is solid.
- Reduced-motion handling everywhere ([HeroSection.tsx](../components/sections/HeroSection.tsx), [Cursor.tsx](../components/animations/Cursor.tsx)).
- WebGL is client-only through `next/dynamic` and pauses off-screen ([HeroBackground.tsx](../components/three/hero-background/HeroBackground.tsx)).
- `Cursor` already supports `data-cursor="magnetic" | "view" | "text"`. That's the right base for Cuberto-style interaction.
- Theme init script avoids a theme flash ([layout.tsx](../app/layout.tsx), [lib/theme/](../lib/theme/)).

### 2.2 Problems blocking a "lightweight premium" result

| # | Issue | Where | Impact |
|---|---|---|---|
| 1 | **Two separate three.js scenes**: morphing blobs with transmission and bloom (hero + CTA), plus a 753-line `BrainWireframe` | `components/three/**`, [WhoWeAreSection.tsx](../components/sections/WhoWeAreSection.tsx), [CTASection.tsx](../components/sections/CTASection.tsx) | three + R3F + drei is the biggest client chunk. GPU-heavy on laptops and phones. Generic "AI agency" look. |
| 2 | **Three animation libraries**: GSAP, framer-motion (used in only 3 files), Lenis | `CircleViewButton`, `FaqSection`, `ProjectsGridSection` | You ship framer-motion (~30–40KB gz) for one accordion and two stagger effects. |
| 3 | **Blocking `Loader`** runs a 1.4s counter, then a 0.6s fade, on each new session | [Loader.tsx](../components/animations/Loader.tsx) | Adds ~2s of perceived delay before LCP. Premium sites in 2026 don't make first-time visitors wait. |
| 4 | **Palette switcher with 6 palettes, plus a settings drawer** | [color-palettes.ts](../lib/constants/color-palettes.ts), `ColorPaletteSwitcher`, `SettingsDrawer` | A brand that lets visitors recolor it has no identity. It also adds `vaul` and extra JS. |
| 5 | **Generic palette**: indigo `#5b5fff` + violet + cyan | `globals.css :root` | The most common SaaS/AI gradient trio, which reads as a template. |
| 6 | **Generic fonts**: Sora + Inter | [layout.tsx](../app/layout.tsx) | No typographic voice. |
| 7 | **Light mode built by swapping `--color-white` and `--color-black`** | `globals.css` THEMES block | It works, but `text-white` meaning "dark ink" will confuse every future contributor. A redesign is the right moment to move to semantic tokens (`--ink`, `--paper`, `--line`). |
| 8 | **~10MB of unused images**: `public/bg-hero.png` (7.1MB), `public/bg-hero-2.png` (3.1MB) | `public/` | Neither is referenced in `app/`, `components/` or `lib/`. Repo bloat, and both are still served publicly. |
| 9 | **Hero copy**: two rotating headlines, `capitalize` on the h1 ("We Build Digital Products…"), and a second headline that reads defensive ("…websites that AI can't be trusted to build") | [hero.ts](../lib/data/hero.ts), `HeroSection` h1 | Rotating headlines dilute the message, and Title Case looks less premium than sentence case. |
| 10 | **Weak proof metrics**: "5+ products, 4+ years, 2 founders" | `heroMetrics` | Big clients compare these with "300+ projects". Better to show outcomes per case study (e.g. "-42% load time", "3× signups") or client logos. |
| 11 | **`DiagonalPattern`, `ParallaxImage`, `AnimatedDivider` decorative layers** | `components/animations/*` | Each is fine alone. Together they add visual noise the references don't have. |

---

## 3. Proposed design system — "Monochrome Editorial + One Signal"

### 3.1 Color tokens

```css
:root {
  /* Light (default for marketing pages; co.design-style warm paper) */
  --paper:   #F2EFEA;   /* page */
  --paper-2: #E8E4DE;   /* raised surface */
  --ink:     #0E0E10;   /* text */
  --ink-2:   #5C5B58;   /* secondary text */
  --line:    color-mix(in oklch, var(--ink) 10%, transparent);
  --signal:  #5B5FFF;   /* ONE accent. Keep Brain Stack indigo, or pick one below */
}
[data-theme="dark"] {
  --paper:   #0A0A0B;   /* x.ai-style near-black, not pure #000 */
  --paper-2: #131315;
  --ink:     #EDEBE7;   /* warm off-white text */
  --ink-2:   #8A8985;
  --line:    color-mix(in oklch, var(--ink) 9%, transparent);
}
```

**Accent options.** Pick one; the rest of the UI stays monochrome.

| Option | Hex | Feel |
|---|---|---|
| A. Refined Brain Stack indigo | `#5B5FFF` | Keeps brand continuity |
| B. Signal lime (Grainient-like) | `#C8F04A` | Bold, modern, very memorable on black |
| C. Electric orange | `#FF4D1A` | Warm, confident, engineering-studio |

Rule: the accent appears on **≤ 5% of pixels**: the one emphasized word in the hero, the primary CTA, active states and the cursor. Never as a section background.

### 3.2 Typography

| Role | Free option (recommended now) | Paid upgrade later |
|---|---|---|
| Display / headings | **Geist** (weight 500, tracking `-0.04em`) | PP Neue Montreal / PP Object Sans |
| Body | Geist 400 | Neue Haas Grotesk Text |
| Labels / numbers / meta | **Geist Mono** 400, 11–13px, uppercase, `tracking-wider` | — |

Scale (desktop): `160 / 96 / 64 / 40 / 24 / 18 / 15 / 13 / 11`. Use `clamp()` for fluid sizes. Headlines in **sentence case**, max 2–3 lines.

Load both with `next/font` as variable fonts, which is one request each and no layout shift. (Check the current `next/font` API in `node_modules/next/dist/docs/` per AGENTS.md.)

### 3.3 Layout and grid

- 12-column grid, `max-width: 1600px`, gutters `16px` mobile / `32px` desktop.
- Sections are separated by **1px `--line` hairlines**, not background color changes.
- Every section starts with a mono label row: `[02]  SERVICES  ———————  2016–2026`.
- Generous vertical rhythm: `py-32` → `py-48` on desktop.

### 3.4 Texture

- ~~Global grain overlay~~ — tried in Phase 1 and removed (too visible on the light theme). Keep surfaces clean.
- **Gradient only inside media frames** (case-study covers, CTA panel), Grainient-style, never as the page background.

### 3.5 Motion language

```ts
export const ease = "cubic-bezier(0.22, 1, 0.36, 1)"   // x.ai's curve. Use everywhere
export const dur  = { xs: 150, sm: 300, md: 500, lg: 700, xl: 1000 }
```

| Pattern | Where | Implementation |
|---|---|---|
| **Line reveal** (each line slides up from a mask) | All H1/H2 | GSAP + a tiny custom line-splitter, or CSS `@keyframes` with `animation-timeline: view()` where supported |
| **Fade-up on enter** (y: 24 → 0, opacity) | Paragraphs, cards | One shared `IntersectionObserver` with CSS classes, no per-element JS tweens |
| **Magnetic buttons** | Primary CTA, nav CTA, footer email | Existing `Cursor` `data-cursor="magnetic"` |
| **Cursor → "View" pill** | Case-study cards | Existing `data-cursor="view"` |
| **Hover-to-play video** | Case-study cards | `<video muted loop playsinline preload="none">` with a poster image. Play on `pointerenter` and pause on leave |
| **Typing product mockup** | Hero (x.ai idea) | Pure CSS/JS "build log" terminal, no library |
| **Page transitions** | Route changes | View Transitions API (check Next 16's `viewTransition` support in local docs first) |
| **Marquee** | Client logos / tagline | CSS `@keyframes translateX`, paused on hover |

Banned: bounce/elastic easing, blur-in on body text, rotating headlines, parallax on more than one layer, loaders.

---

## 4. New homepage structure

| # | Section | Inspired by | Content |
|---|---|---|---|
| 0 | **Nav**: logo, 4 links, mono "Available for Q1 2027", magnetic "Start a project" | x.ai, Cuberto | Transparent, then turns into a hairline-bordered bar after scrolling |
| 1 | **Hero**: one sentence at 120–160px, one accent word. Right/below: a live "build log" terminal mockup of a real Brain Stack project. 2 CTAs. | x.ai | e.g. *"Software for companies that can't afford to ship it twice."* |
| 2 | **Logo marquee and proof strip**: client logos plus 3 outcome stats | Cuberto, co.design | Use measurable outcomes, not headcount |
| 3 | **Selected work**: 3–4 large case studies (full-bleed, 16:10), hover video, cursor "View", mono meta (`FINTECH · 2026 · WEB + APP`) | Cuberto, co.design | The most important section. Spend the effort here. |
| 4 | **Services as a numbered list**: `01 Product Engineering`, `02 Web Platforms`, `03 Mobile`, `04 AI Automation`. On hover, a row expands to show a short description and one image that follows the cursor. | co.design | Replaces icon cards |
| 5 | **Approach / process**: 4 steps on a horizontal hairline timeline (Discover → Design → Develop → Automate) | x.ai | Reuse `heroTagline` data |
| 6 | **Founders**: two portraits (B&W, colorizes on hover) and a short manifesto quote | co.design | Keeps the human trust signal |
| 7 | **FAQ**: accordion built with `<details>`/`<summary>` and CSS | Cuberto | Removes the framer-motion dependency |
| 8 | **Footer CTA**: giant "Let's build →" wordmark (~20vw), email with magnetic hover, clean dark panel | Cuberto, Grainient | Replaces the second WebGL scene |

The `/projects/[slug]` case-study page should follow co.design: full-bleed cover → mono meta table (Client / Industry / Year / Services) → challenge → solution → big image pairs → outcome numbers → next-project teaser (full-width, click to navigate).

---

## 5. Lightweight engineering plan

### 5.1 Dependencies

| Package | Action | Why |
|---|---|---|
| `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` | **Remove** | Biggest client cost. Replace the hero with a typographic hero and mockup, and the CTA with a clean CSS gradient panel. If you still want a moving gradient, write one ~60-line raw WebGL fragment shader (no library) that renders only in view. |
| `framer-motion` | **Remove** | Only 3 usages. Replace with `<details>` and CSS/GSAP. |
| `vaul` + `SettingsDrawer` + `ColorPaletteSwitcher` | **Remove** | Single brand palette. Keep a small dark/light toggle in the nav (`ThemeModeSwitcher`). |
| `gsap`, `@gsap/react` | Keep | Scroll reveals, magnetic effect, cursor |
| `lenis` | Keep, but optional | Disable on touch devices |
| `shadcn` (in `dependencies`) | Move to `devDependencies` | It's a CLI, not a runtime library |

### 5.2 Delete or replace

- `public/bg-hero.png`, `public/bg-hero-2.png`: unused (≈10MB).
- `components/animations/Loader.tsx`: remove it. If you want a branded intro, show a 300ms logo fade over already-rendered content, without blocking.
- `components/three/**`, `components/animations/DiagonalPattern.tsx`, `ParallaxImage.tsx`, `hero-panel/AnimatedDivider.tsx`.
- `lib/constants/color-palettes.ts`, `lib/theme/` palette parts (keep mode only).

### 5.3 Performance budget (enforce in CI with Lighthouse or `next build` output)

| Metric | Target |
|---|---|
| LCP (4G, mid-range phone) | **< 1.8s** |
| CLS | **0** |
| INP | < 150ms |
| Initial JS (home, gzipped) | **< 120KB** |
| Hero media | Text-based LCP (no image) or AVIF under 80KB |
| Case-study videos | `preload="none"`, poster AVIF, MP4/H.264 + WebM, ≤ 1.5MB each, 6–8s loop |

### 5.4 Token migration

Replace the "`text-white` means ink" trick with semantic Tailwind v4 theme tokens:

```css
@theme inline {
  --color-paper: var(--paper);
  --color-paper-2: var(--paper-2);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-line: var(--line);
  --color-signal: var(--signal);
  --font-display: var(--font-geist);
  --font-mono: var(--font-geist-mono);
}
```

Then use `bg-paper text-ink border-line` everywhere. Light and dark mode then only redefine the variables, with no inverted class meanings.

---

## 6. Roadmap

| Phase | Scope | Output |
|---|---|---|
| **1. Foundation** (2–3 days) | Tokens, fonts, motion constants; remove Loader, palette switcher, unused PNGs | Site already looks calmer and loads faster |
| **2. Hero, nav and footer** (3–4 days) | Typographic hero, build-log mockup, new nav, giant footer CTA; remove three.js | Biggest visual and performance jump |
| **3. Work** (4–5 days) | Case-study cards with hover video and cursor, new `/projects/[slug]` template | The "big client" credibility layer |
| **4. Services, process, founders and FAQ** (3 days) | Numbered services list, timeline, `<details>` FAQ; remove framer-motion | Full homepage done |
| **5. Polish** (2 days) | View transitions, magnetic tuning, Lighthouse pass, mobile QA (16px gutters, no horizontal scroll) | Ready to launch |

### Content to collect before Phase 3

- 3–4 strongest projects: 6–8s screen-recorded loops, cover images, and **one measurable outcome each**
- Client logos you're allowed to show
- One-sentence positioning line (pick one, no rotation)
- B&W founder portraits shot in the same light
