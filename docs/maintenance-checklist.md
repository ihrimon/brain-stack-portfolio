# Brain Stack — Maintenance Checklist

**Purpose:** recurring tasks to keep this codebase from drifting back into the state it was in before the 2026-07-18 cleanup — distinct from [`deployment-checklist.md`](./deployment-checklist.md), which is a one-time pre-launch gate. Nothing here is urgent; everything here is what "long-term maintainability" actually looks like in practice.

---

## Weekly / per-PR

- [ ] `npm run typecheck && npm run lint && npm run build` clean before merging. All three are fast enough to run on every PR; there's no excuse to skip one.
- [ ] New section component? Check it against [`component-guidelines.md`](./component-guidelines.md) §2 before merging — props typed against a `lib/data/<page>.ts` export, `useGSAP` scoped correctly, no data-fetching inside the component.
- [ ] New data field? Check [`coding-guidelines.md`](./coding-guidelines.md) §"Data file convention" — does it fit `SectionHeader`/`ProcessStep`/`FeatureCard`/`ServiceOffering` before inventing a new shape?

## Monthly

- [ ] **Grep for obviously-dead exports.** Until `ts-prune` (or equivalent) is wired into CI — see `roadmap.md` item 13, still the single highest-leverage open item — this is a manual step. Pick a handful of recently-touched files and confirm every export still has a real importer.
- [ ] **Re-check `npm outdated`** for the core framework trio (`next`, `react`, `react-dom`) and GSAP/`@gsap/react` — these move fast and this project tracks recent majors deliberately.
- [ ] **Scan `components/sections/` file count.** At ~40 files, execute the subfolder reorganization documented in `roadmap.md` item 12 — don't wait until it's unnavigable to start.

## Quarterly

- [ ] **Re-run the circular-dependency check** (`npx madge --circular --extensions ts,tsx .` or equivalent) after any significant refactor — the architecture is clean today (verified manually in the 2026-07-18 pass: `lib/` never imports from `components/`/`app/`, no section imports another section) specifically *because* nothing currently creates the conditions for a cycle. That can change silently as the codebase grows.
- [ ] **Check content volume against the two deferred-scaling triggers:**
  - `generateStaticParams` bounding (`rendering-strategy.md`) — trigger: either Projects or Blog sheet passes ~100–150 rows.
  - Google Sheets as CMS governance ceiling (`architecture-audit.md` §14) — trigger: content volume or editor count growing past "a couple of people, low hundreds of rows."
- [ ] **Re-verify the Sheets fallback still works.** Temporarily unset `GOOGLE_SHEET_ID` in a non-production environment and confirm every page still renders from `lib/data/*.ts` fallback content. This has been true throughout development (this environment never had live Sheets credentials configured) but hasn't been re-verified against a *previously-working* live connection — that's a meaningfully different failure mode to test.
- [ ] **Review the accessibility color-contrast finding** (`performance-guide.md` §6) — `text-white/30`/`/40` on the dark theme. Still not fixed as of this writing; revisit with design input rather than letting it sit indefinitely.

## On every Google Sheets schema change

- [ ] Follow the migration pattern in `scripts/migrate-sheet-schema.ts`, not an ad-hoc column edit — see [`google-sheet-schema.md`](./google-sheet-schema.md) §3 for which parts of the schema are "frozen contract" (tabular column headers) vs. safely renameable (JSON keys inside key-value tab cells, provided every existing cell's JSON is updated to match).
- [ ] Regenerate the affected CSV export (`npx tsx scripts/export-<page>-csv.ts`) so the committed snapshot in `scripts/` doesn't go stale — this was missed for a while before the 2026-07-18 pass caught it during the data-layer normalization.
- [ ] Update `google-sheet-schema.md`'s column/key tables in the same PR as the schema change. A schema doc that's wrong is worse than no schema doc — it actively misleads the next person, exactly like the pre-2026-07-18 README did for the Sheets integration as a whole.

## When onboarding a new developer

- [ ] Point them at `README.md` → `docs/project-overview.md` → `docs/component-guidelines.md`, in that order. Don't let them discover the codebase by grepping cold.
- [ ] If anything in the docs turns out to be wrong by the time they read it, that's a signal the doc-update habit above has lapsed — fix the doc as part of their onboarding PR, not as a someday-task.

## Signals that a bigger review is due (not scheduled — watch for these)

- `components/sections/` crosses ~40 files without the subfolder split having happened.
- A second person starts editing the Google Sheet regularly (governance ceiling approaching — see `architecture-audit.md` §14).
- Any `lib/data/*.ts` file crosses ~400 lines (split-by-section trigger, documented in `coding-guidelines.md`).
- A new "some entries get a full write-up, others don't" content need arises outside Projects — reach for the `BaseX`/`XSummary`/`XDetailed` discriminated-union pattern (`coding-guidelines.md` §"Discriminated-union convention") rather than bolting nullable fields onto an existing interface.
