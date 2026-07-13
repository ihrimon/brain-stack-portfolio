# Brain Stack Portfolio Website

A modern, premium, and enterprise-grade portfolio website for **Brain Stack**, showcasing software engineering, AI development, digital transformation, and technology consulting services.
Brain Stack is a software and AI-focused technology company helping startups, businesses, and enterprises build scalable digital products, intelligent automation solutions, and modern web applications. This project serves as the official company portfolio and marketing website.

## Tech Stack

* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion
* HugeIcons
* Next Themes
* ESLint
* Prettier
* SEO Optimization


## Key Features

### Modern SaaS Design

* Enterprise-grade UI
* Premium layouts
* Clean typography
* Glassmorphism effects
* Smooth interactions

### Theme System

* Light Mode
* Dark Mode
* Multiple Color Presets

  * Blue
  * Purple
  * Emerald
  * Orange
  * Rose

### Responsive Experience

Optimized for:

* Mobile
* Tablet
* Laptop
* Desktop
* Ultrawide Screens

### Performance Focused

* Static Rendering
* Optimized Assets
* Lazy Loading
* Code Splitting
* Fast Initial Load

### SEO Ready

* Metadata Configuration
* Open Graph Tags
* Twitter Cards
* Sitemap
* Robots.txt


## Landing Page Sections

### 1. Hero Banner

* Company Introduction
* AI & Software Engineering Positioning
* CTA Buttons
* Animated Statistics
* Interactive Visual Elements

### 2. Trusted Companies

* Client Logos
* Infinite Marquee Animation

### 3. What We Do

* Company Overview
* Service Highlights

### 4. Mission & Core Values

* Mission Statement
* Vision Statement
* Core Values

### 5. Services

* Custom Software Development
* AI Development
* Web Development
* SaaS Development
* Business Automation
* Technical Consulting

### 6. Why Choose Brain Stack

* Competitive Advantages
* Business Value Proposition

### 7. How We Engineer

* Discovery
* Planning
* Design
* Development
* AI Integration
* Testing
* Launch
* Support

### 8. Capabilities

* Frontend Engineering
* Backend Systems
* Cloud Solutions
* DevOps
* Artificial Intelligence
* Automation

### 9. Integrations & Technology Stack

* Frontend Technologies
* Backend Technologies
* Cloud Platforms
* AI Tools
* DevOps Tools

### 10. Client Testimonials

* Client Reviews
* Success Stories

### 11. Frequently Asked Questions

* Common Client Questions
* Service Information

### 12. Call To Action

* Lead Generation Section
* Contact Invitation

### 13. Footer

* Company Information
* Navigation Links
* Social Links

## Animation System

Powered by Framer Motion.

Includes:

* Fade Up Animations
* Scroll Reveal Effects
* Stagger Animations
* Hover Interactions
* Floating Effects
* Counter Animations
* Marquee Animations

## Accessibility

The project follows modern accessibility practices:

* Semantic HTML
* Keyboard Navigation
* Proper ARIA Labels
* Sufficient Color Contrast
* Responsive Typography


## Case Studies via Google Sheets

Case study content (`/case-studies` and its detail pages, plus the homepage teaser) is fetched from a Google Sheet at request time, with ISR (`revalidate = 300`, i.e. every 5 minutes). If Sheets isn't configured yet, or the request fails, the site automatically falls back to the seed data in [lib/data/caseStudies.ts](lib/data/caseStudies.ts) — so it always works, even before setup.

### 1. Google Cloud project & service account

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. **APIs & Services → Library** → enable **Google Sheets API**.
3. **APIs & Services → Credentials → Create Credentials → Service Account**.
4. Open the service account → **Keys → Add Key → JSON**, download it.
5. Note the `client_email` in that JSON, e.g. `agency-site@your-project.iam.gserviceaccount.com`.

### 2. Create & share the Sheet

1. Create a Google Sheet with a tab named exactly **`CaseStudies`**.
2. Row 1 = header, data starts row 2. Column order (A → AF):

   ```
   id, slug, title, shortTitle, category, industry, client, duration, status, liveUrl,
   thumbnail, heroImage, gallery, overview, challenge, goals, solution, workflow,
   technologies, tools, architecture, features, uiHighlights, developmentProcess,
   challengesFaced, solutionsImplemented, results, metrics, testimonial,
   lessonsLearned, nextSteps, relatedProjects
   ```

   Simple fields (`id`, `slug`, `title`, `status`, `overview`, …) are plain text cells. `liveUrl` may be left blank (treated as "no live site"). Every other field — `gallery`, `challenge`, `goals`, `solution`, `workflow`, `technologies`, `tools`, `architecture`, `features`, `uiHighlights`, `developmentProcess`, `challengesFaced`, `solutionsImplemented`, `results`, `metrics`, `testimonial`, `lessonsLearned`, `nextSteps`, `relatedProjects` — is a **JSON string in one cell**, e.g. `["Next.js","Node.js"]` or `{"title":"...","description":"...","keySolutions":["..."]}`.

3. **Fastest way to populate it:** run `npx tsx scripts/export-case-studies-csv.ts`, which regenerates `scripts/case-studies-export.csv` from the current seed data. In Google Sheets: **File → Import → Upload**, select that CSV, and choose "Replace current sheet" (or import into a sheet renamed to `CaseStudies`). This gives you all 10 existing case studies pre-filled, ready to edit.
4. Click **Share**, add the service account's `client_email` with **Viewer** access.
5. Copy the **Spreadsheet ID** from the sheet's URL (the part between `/d/` and `/edit`).

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in the three values from steps above:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=agency-site@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-spreadsheet-id
```

`.env.local` is gitignored — never commit it. `GOOGLE_PRIVATE_KEY` must keep its `\n` sequences exactly as they appear in the downloaded JSON (paste the whole `private_key` value in quotes).

Once these are set, restart the dev server (or redeploy) — `lib/sheets.ts` picks them up automatically and every case-study page starts reading from the Sheet, refreshing every 5 minutes.

## License

This project is developed exclusively for Brain Stack.

All rights reserved © Brain Stack.
