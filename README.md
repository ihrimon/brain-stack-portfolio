# Brain Stack

The official marketing site for **Brain Stack**, a full-stack software studio building web, mobile, and AI-powered products. Built with Next.js App Router, TypeScript, Tailwind CSS v4, and GSAP.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4, shadcn/ui primitives
- **Animation:** GSAP + `@gsap/react` (scroll reveals, cursor, counters), Lenis (smooth scroll), Framer Motion (a small number of card-reveal animations), React Three Fiber (`three`, dynamically loaded) for the About page's brain visualization
- **Content:** typed, hand-written data in `lib/data/*.ts` — no external CMS
- **Deployment target:** any Next.js host (Vercel, etc.)

## Getting started

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000` immediately — no environment setup is required to start developing. Every page's content lives in `lib/data/*.ts`.

## Available scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve a production build (`build` first) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier, writes in place |
| `npm run typecheck` | `tsc --noEmit` |

## Project structure

```
app/            # Routes (App Router) — composition only, no business logic
components/     # UI, grouped by role: sections/ buttons/ common/ animations/ layout/ ui/ three/
lib/            # Data (lib/data/), utils, constants, the one Server Action
hooks/          # Custom hooks (currently empty — scaffolding for the next one)
public/         # Images, icons, videos
docs/           # Full documentation set — start with docs/project-overview.md
```

Full folder-by-folder review: [`docs/folder-structure.md`](docs/folder-structure.md).

## Content

Every page's content (Home, About, Services, Blog, Projects) is authored directly in `lib/data/*.ts` — no external CMS or spreadsheet integration is involved. Edit the relevant file and the change is live on the next request (ISR, `revalidate = 300`).

## Documentation

This project is documented in depth under [`docs/`](docs/):

| Document | Covers |
|---|---|
| [`project-overview.md`](docs/project-overview.md) | Request-to-pixels flow, the "add a new page" pattern — start here |
| [`folder-structure.md`](docs/folder-structure.md) | Every folder, why it exists, what belongs where |
| [`coding-guidelines.md`](docs/coding-guidelines.md) | Naming, imports, the data-layer schema convention |
| [`component-guidelines.md`](docs/component-guidelines.md) | Where a new component goes, the standard section template, when (not) to extract a shared component |
| [`rendering-strategy.md`](docs/rendering-strategy.md) | SSG/ISR decisions per route, and why |
| [`seo-strategy.md`](docs/seo-strategy.md) | Metadata, sitemap, structured data |
| [`performance-guide.md`](docs/performance-guide.md) | Images, bundle size, error handling, accessibility |
| [`deployment-checklist.md`](docs/deployment-checklist.md) | Pre-launch and pre-release checklist |
| [`maintenance-checklist.md`](docs/maintenance-checklist.md) | Ongoing, recurring maintenance tasks |
| [`architecture-audit.md`](docs/architecture-audit.md) | Full architecture audit history |
| [`final-engineering-report.md`](docs/final-engineering-report.md) | Cumulative summary of all engineering phases |
| [`roadmap.md`](docs/roadmap.md) | What's left, prioritized |

## License

Developed exclusively for Brain Stack. All rights reserved © Brain Stack.

