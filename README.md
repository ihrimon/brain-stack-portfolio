# Brain Stack

The official marketing site for **Brain Stack**, a full-stack software studio building web, mobile, and AI-powered products. Built with Next.js App Router, TypeScript, Tailwind CSS v4, and GSAP.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4, shadcn/ui primitives
- **Animation:** GSAP + `@gsap/react` (scroll reveals, cursor, counters), Lenis (smooth scroll), Framer Motion (a small number of card-reveal animations), React Three Fiber (`three`, dynamically loaded) for the About page's brain visualization
- **Content:** typed, hand-written data in `lib/data/*.ts` — no external CMS
- **Deployment target:** Netlify (production: https://brainstackstudios.com)

## Getting started

This project uses **pnpm** exclusively — `pnpm-lock.yaml` is the source of truth for dependency versions; don't run `npm install` (it would create a second, conflicting lockfile).

```bash
pnpm install
pnpm dev
```

The site runs at `http://localhost:3000` immediately — no environment setup is required to start developing. Every page's content lives in `lib/data/*.ts`.

To have the contact form actually deliver email locally, copy `.env.example` to `.env.local` and fill in `GMAIL_USER`/`GMAIL_APP_PASSWORD` (see the comments in that file for how to generate a Gmail App Password).

## Available scripts

| Command | Does |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve a production build (`build` first) |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier, writes in place |
| `pnpm typecheck` | `tsc --noEmit` |

## Project structure

```
app/            # Routes (App Router) — composition only, no business logic
components/     # UI, grouped by role: sections/ buttons/ common/ animations/ layout/ ui/ three/
lib/            # Data (lib/data/), utils, constants, the one Server Action
hooks/          # Custom hooks (e.g. useServicesScrollStack)
public/         # Images, icons, videos
docs/           # Content brief and optimization notes
```

## Content

Every page's content (Home, About, Services, Blog, Projects) is authored directly in `lib/data/*.ts` — no external CMS or spreadsheet integration is involved. Edit the relevant file and the change is live on the next request (ISR, `revalidate = 300`).

## License

Developed exclusively for Brain Stack. All rights reserved © Brain Stack.

