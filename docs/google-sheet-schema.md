# Brain Stack — Google Sheets CMS Schema Reference

**Audience:** anyone setting up or editing the live content Sheet — content editors and developers alike. This is the authoritative schema reference; if `README.md`'s Sheets section and this document ever disagree, trust this one and file a doc fix.

**One spreadsheet, five tabs** — `Home`, `About`, `Services`, `Blog`, `Projects` — one per page. See [`data-architecture.md`](./data-architecture.md) for the underlying fetch/fallback architecture; this document is the "what goes in which cell" reference.

---

## 1. Setup (one-time)

1. **Google Cloud project & service account**
   - Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
   - **APIs & Services → Library** → enable **Google Sheets API**.
   - **APIs & Services → Credentials → Create Credentials → Service Account** → **Keys → Add Key → JSON**, download it.
   - Note the `client_email` from that JSON (e.g. `agency-site@your-project.iam.gserviceaccount.com`).
2. **Create the spreadsheet** with exactly five tabs named `Home`, `About`, `Services`, `Blog`, `Projects` (case-sensitive, must match exactly).
3. **Share the spreadsheet** with the service account's `client_email`, **Viewer** access only — the app only ever reads (`spreadsheets.readonly` scope in `lib/utils/sheets/shared.ts`).
4. **Copy the Spreadsheet ID** from the sheet's URL (the segment between `/d/` and `/edit`).
5. **Environment variables** — copy `.env.example` to `.env.local` and fill in:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=agency-site@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=your-spreadsheet-id
   ```
   `GOOGLE_PRIVATE_KEY` must keep its `\n` sequences exactly as they appear in the downloaded JSON — paste the whole `private_key` value in quotes. `.env.local` is gitignored; never commit it.
6. Restart the dev server (or redeploy). If any of the three variables is missing, every page silently falls back to the local seed data in `lib/data/*.ts` — the site never breaks, it just serves the built-in fallback copy until Sheets is configured.

**Fastest way to populate a tab:** run the matching export script, which regenerates a ready-to-import CSV from the current fallback data:

| Script | Output | Import into tab |
|---|---|---|
| `npx tsx scripts/export-home-csv.ts` | `scripts/home-export.csv` | `Home` |
| `npx tsx scripts/export-about-csv.ts` | `scripts/about-export.csv` | `About` |
| `npx tsx scripts/export-service-csv.ts` | `scripts/service-export.csv` | `Services` |
| `npx tsx scripts/export-blog-csv.ts` | `scripts/blog-export.csv` | `Blog` |
| `npx tsx scripts/export-projects-csv.ts` | `scripts/projects-export.csv` | `Projects` |

In Google Sheets: **File → Import → Upload**, select the CSV, choose "Replace current sheet" (with that tab active) or "Insert new sheet" then rename it to match exactly.

## 2. Two tab shapes

### Key-value tabs: `Home`, `About`, `Services`

2 columns, row 1 = header (`key`, `value`), data from row 2. Each row is one page section; the `value` cell holds that section's **entire content as a JSON object**, edited as a single blob rather than as separate spreadsheet columns.

| Tab | Section keys (one row each) |
|---|---|
| `Home` | `heroBanner`, `projectVideo`, `whoWeAre`, `services`, `process`, `testimonials`, `cta` |
| `About` | `mission`, `stats`, `features`, `approach`, `inquiry`, `whyChooseUs`, `team` |
| `Services` | `spotlight`, `process`, `exclusiveServices`, `banner` |

**Example — `Home` tab, `heroBanner` row:**

| key | value |
|---|---|
| `heroBanner` | `{"badge":"Creative Design Agency","title":"Empowering Businesses Through Technology & Innovation","description":"...","button":{"label":"Start Your Project","href":"/contact"},"review":{"label":"Review on Clutch","rating":5}}` |

If a cell is missing, empty, or fails to parse as JSON, that section falls back to its default from `lib/data/<page>.ts` — a broken cell degrades one section, it never crashes the page (see `data-architecture.md` §1 for how the merge-over-fallback parsing works).

**⚠️ Field names inside these JSON blobs were renamed 2026-07-18** (see `data-architecture.md` §4 for the full list) — if you're editing a Sheet that predates this change, update these keys inside the affected cells:

| Tab | Section | Old key | New key |
|---|---|---|---|
| `About` | `mission` | `approach` (nested) | `pillars` |
| `About` | `approach` | `steps` | `items` |
| `Services` | `process` | `steps` | `items` |
| `Services` | `exclusiveServices` | `categories` | `items` |

### Tabular tabs: `Blog`, `Projects`

One row per item, row 1 = header matching the column names below exactly, data from row 2. Simple fields are plain text cells; array/object fields are a **JSON string in one cell**.

**`Blog`** — columns A→J:

```
slug, title, excerpt, category, author, comments, publishDate, featuredImage, tags, content
```

- Plain cells: `slug`, `title`, `excerpt`, `category`, `author`, `comments` (number), `publishDate` (`YYYY-MM-DD`), `featuredImage` (an image URL or local `/images/...` path).
- JSON cells: `tags` — a string array, e.g. `["AI","Engineering"]`. `content` — an array of rich-content blocks, e.g.:
  ```json
  [
    {"type":"paragraph","text":"..."},
    {"type":"heading","text":"..."},
    {"type":"list","items":["...","..."]},
    {"type":"image","src":"/images/blog/x.webp","alt":"..."},
    {"type":"imageGrid","images":[{"src":"...","alt":"..."},{"src":"...","alt":"..."}]},
    {"type":"sideBySide","image":{"src":"...","alt":"..."},"text":"..."}
  ]
  ```

**`Projects`** — columns A→AH (34 columns):

```
id, slug, title, shortTitle, category, industry, client, service, duration, date, status, liveUrl,
thumbnail, heroImage, gallery, overview, challenge, goals, solution, workflow,
technologies, tools, architecture, features, uiHighlights, developmentProcess,
challengesFaced, solutionsImplemented, results, metrics, testimonial,
lessonsLearned, nextSteps, relatedProjects
```

- Plain cells: `id`, `slug`, `title`, `shortTitle`, `category`, `industry`, `client`, `service`, `duration`, `date`, `status`, `liveUrl` (blank = "no live site"), `thumbnail`, `heroImage`, `overview`.
- JSON array cells: `gallery`, `goals`, `technologies`, `tools`, `architecture`, `features`, `uiHighlights`, `developmentProcess`, `challengesFaced`, `solutionsImplemented`, `results`, `lessonsLearned`, `nextSteps`, `relatedProjects` (an array of other projects' `slug` values), `workflow` (array of `{"title":"...","description":"..."}`).
- JSON object cells: `challenge` (`{"title":null,"description":"...","painPoints":[...],"businessImpact":[...]}`), `solution` (`{"title":"...","description":"...","highlights":[...]}`), `metrics` (`{"performance":"96/100","seo":"94/100","accessibility":"97/100","bestPractices":"100/100"}`), `testimonial` (`{"name":"...","role":"...","company":"...","quote":"...","image":"..."}`).

**Leave a project "thin" (portfolio-only, no deep case study) by leaving `workflow`, `architecture`, `features`, `developmentProcess`, `challengesFaced`, `solutionsImplemented`, `results`, `metrics`, `testimonial` empty.** The app detects this automatically — no separate "type" column exists or is needed. See `data-architecture.md` §6 for exactly how a project is classified as `"case-study"` vs. `"portfolio"`.

## 3. What never changes without a real migration

`PROJECTS_SHEET_COLUMNS` and `BLOG_SHEET_COLUMNS` (the tabular column headers above) are treated as a frozen contract — unlike the key-value tabs' JSON keys (which changed 2026-07-18, see §2), these column names are the literal header row a content editor sees and types into. If a column genuinely needs to be renamed or added, that requires updating `lib/utils/sheets/blog.ts` / `projects.ts`'s `COLUMNS` array, `lib/data/blog-page.ts` / `projects-page.ts`'s matching interface, **and** every existing spreadsheet's header row — coordinate a real migration (see `scripts/migrate-sheet-schema.ts` for the pattern used for the last Projects schema change) rather than editing the column list ad hoc.

## 4. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Whole site shows default/fallback copy, Sheets edits don't appear | Env vars missing or wrong | Check `GOOGLE_SERVICE_ACCOUNT_EMAIL`/`GOOGLE_PRIVATE_KEY`/`GOOGLE_SHEET_ID` are set and the server was restarted after setting them |
| One section shows default copy, rest of the page is fine | That section's JSON cell is empty or malformed | Validate the cell's JSON (a linter/formatter website works); check for the field-rename table in §2 if the Sheet predates 2026-07-18 |
| Edits take up to 5 minutes to appear | Expected — ISR `revalidate = 300` | Not a bug; wait, or trigger a redeploy for an instant refresh |
| A whole tab's data reverts to fallback | Tab renamed, deleted, or service account lost access | Confirm the tab name matches exactly (`Home`/`About`/`Services`/`Blog`/`Projects`) and the service account still has Viewer access |
