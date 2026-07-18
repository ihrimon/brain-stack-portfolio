# Brain Stack

The official marketing site for **Brain Stack**, a full-stack software studio building web, mobile, and AI-powered products. Built with Next.js App Router, TypeScript, Tailwind CSS v4, and GSAP, with content editable through a Google Sheets CMS.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4, shadcn/ui primitives
- **Animation:** GSAP + `@gsap/react` (scroll reveals, cursor, counters), Lenis (smooth scroll), Framer Motion (a small number of card-reveal animations), React Three Fiber (`three`, dynamically loaded) for the About page's brain visualization
- **CMS:** Google Sheets, via the `googleapis` package — see [Content & Google Sheets](#content--google-sheets) below
- **Deployment target:** any Next.js host (Vercel, etc.)

## Getting started

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000` immediately — no environment setup is required to start developing. Every page has typed, hand-written fallback content in `lib/data/*.ts` that renders until (and unless) Google Sheets is configured, so the app is always in a working state.

## Available scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve a production build (`build` first) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier, writes in place |
| `npm run typecheck` | `tsc --noEmit` |
| `npx tsx scripts/export-<page>-csv.ts` | Regenerate a Sheets-ready CSV for one page from the current fallback data — see [`docs/google-sheet-schema.md`](docs/google-sheet-schema.md) |

## Project structure

```
app/            # Routes (App Router) — composition only, no business logic
components/     # UI, grouped by role: sections/ buttons/ common/ animations/ layout/ ui/ three/
lib/            # Data (lib/data/), Sheets integration (lib/utils/sheets/), utils, constants, the one Server Action
hooks/          # Custom hooks (currently empty — scaffolding for the next one)
public/         # Images, icons, videos
scripts/        # Dev-time tooling: CSV export, Sheet schema migration
docs/           # Full documentation set — start with docs/project-overview.md
```

Full folder-by-folder review: [`docs/folder-structure.md`](docs/folder-structure.md).

## Content & Google Sheets

Every page's content (Home, About, Services, Blog, Projects) is fetched from a 5-tab Google Sheet at request time, cached for 5 minutes (ISR, `revalidate = 300`). Without Sheets configured, the site runs entirely on the fallback content in `lib/data/*.ts` — nothing breaks, nothing is required to get started.

**To connect a live Sheet:** follow [`docs/google-sheet-schema.md`](docs/google-sheet-schema.md) — service account setup, sharing, environment variables, and the exact schema for all 5 tabs.

## Documentation

This project is documented in depth under [`docs/`](docs/):

| Document | Covers |
|---|---|
| [`project-overview.md`](docs/project-overview.md) | Request-to-pixels flow, the "add a new page" pattern — start here |
| [`folder-structure.md`](docs/folder-structure.md) | Every folder, why it exists, what belongs where |
| [`coding-guidelines.md`](docs/coding-guidelines.md) | Naming, imports, the data-layer schema convention |
| [`component-guidelines.md`](docs/component-guidelines.md) | Where a new component goes, the standard section template, when (not) to extract a shared component |
| [`data-architecture.md`](docs/data-architecture.md) | The Sheets ↔ fallback data model in depth |
| [`google-sheet-schema.md`](docs/google-sheet-schema.md) | Exact spreadsheet schema, setup steps, troubleshooting |
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
