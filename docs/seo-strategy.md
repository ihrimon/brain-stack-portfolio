# Brain Stack — SEO Implementation Guide

**Status:** ✅ Per-page metadata, sitemap, robots, and structured data (JSON-LD) all implemented and verified 2026-07-18 — see the "Implemented" callouts inline below, and §"Structured data (JSON-LD)" for the full schema reference. See [`architecture-audit.md` §9](./architecture-audit.md#9-seo-audit) for the original gap this closes.

---

## Current state (as of 2026-07-18)

All 7 routes now export real metadata via `generateMetadata`/`metadata`, sourced from `lib/metadata.ts`. `app/sitemap.ts` and `app/robots.ts` exist and were confirmed in the production build output. The sections below were originally written as a remediation guide before any of this was implemented — they're kept as-is (with "Implemented" notes added) since they now double as the record of what was actually built and why, for anyone touching this code later.

**Previously:** only `app/layout.tsx` set `metadata` (via `defaultMetadata`), so every route rendered with the identical `<title>`, description, and OG image as the home page. This section is left for historical context on what the gap was.

**What existed in `lib/metadata.ts` before this fix, and is now wired up:**

```ts
// lib/metadata.ts — Metadata API (<title>/<meta>/OG) only, as of 2026-07-18
export const pageMetadata = { home: {...}, about: {...}, blog: {...}, services: {...}, projects: {...}, contact: {...} }
export function generatePageMetadata(page: keyof typeof pageMetadata, custom?: Partial<Metadata>): Metadata
export function generateBlogPostMetadata(title, description, publishedTime, slug, image?): Metadata
export function generateProjectMetadata(title, description, slug, image?): Metadata

// lib/structured-data.ts — schema.org JSON-LD, split into its own file 2026-07-18
// (see "Structured data (JSON-LD)" below) — generateBlogPostStructuredData used
// to live in lib/metadata.ts; it's superseded by generateBlogPostingSchema here.
export function generateGlobalSchema()                    // Organization + WebSite, rendered once in app/layout.tsx
export function generateWebPageSchema(page)                // WebPage, one per static route
export function generateBlogPostingSchema(post)             // BlogPosting + BreadcrumbList
export function generateProjectSchema(project)                // CreativeWork + BreadcrumbList
```

`services`, `projects`, and `contact` entries were added to `pageMetadata` (only `home`/`about`/`blog` existed originally), and `generateProjectMetadata` was written from scratch, mirroring `generateBlogPostMetadata`'s shape.

The second, unrelated, unused block that used to live in this file (`seoMetadata`, `structuredDataScript`, pointing at the wrong domain `brainstack.com`) has been **deleted** — it was leftover scaffolding, not a fallback, and was directly in the way of this fix.

## What needs to happen, page by page

### 1. Static pages — `about`, `services`, `contact`

Add to each `page.tsx`:

```ts
import { generatePageMetadata } from "@/lib/metadata"

export const metadata = generatePageMetadata("about") // or "services" — add these
                                                          // two entries to pageMetadata first
```

`pageMetadata` currently only has `home`, `about`, `blog` entries — `services` and `contact` entries need to be added to the object in `lib/metadata.ts` following the exact shape the existing three use.

### 2. Index pages with dynamic content — `projects`, `blog`

Same pattern as above — these are still static per-page metadata (the index page's title doesn't change based on which projects/posts happen to be in it), so `generatePageMetadata("projects")`/`generatePageMetadata("blog")` is sufficient. Add `projects` to `pageMetadata`.

### 3. Dynamic detail pages — `blog/[slug]`, `projects/[slug]`

These need `generateMetadata` as an **async function**, not a static export, since the title/description/OG image depend on which post/project was requested:

```ts
// app/blog/[slug]/page.tsx — pattern to add
import { generateBlogPostMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {} // notFound() in the page component handles the 404 itself

  return generateBlogPostMetadata(
    post.title,
    post.excerpt,
    post.publishDate,
    post.slug,
    post.featuredImage
  )
}
```

`generateBlogPostMetadata` already exists with exactly this signature — this is a matter of calling it, not writing it. `projects/[slug]` needs an equivalent function (`generateProjectMetadata`, not yet written) following the same shape, sourced from `Project.title`/`overview`/`heroImage`.

## Structured data (JSON-LD)

**Implemented and verified 2026-07-18.** Lives in [`lib/structured-data.ts`](../lib/structured-data.ts) (schema.org generators — a distinct file from `lib/metadata.ts`, which owns the Next.js Metadata API) and renders via a single reusable [`<JsonLd>`](../components/common/JsonLd.tsx) component. Every page renders exactly one JSON-LD `<script>` (two on pages that also get a breadcrumb, combined into one `@graph`) — see §"No duplicate schema" below for how repeated nodes (Organization, WebSite) are referenced rather than re-declared.

### What's rendered, where

| Schema | Type(s) | Rendered in |
|---|---|---|
| Organization + WebSite | `Organization`, `WebSite` | `app/layout.tsx` — **once, site-wide**, via `generateGlobalSchema()` |
| WebPage | `WebPage` | Home, About, Services, Projects, Blog, Contact — via `generateWebPageSchema(page)` |
| Blog post | `BlogPosting` + `BreadcrumbList` | `app/blog/[slug]/page.tsx` — via `generateBlogPostingSchema(post)` |
| Project / case study | `CreativeWork` + `BreadcrumbList` | `app/projects/[slug]/page.tsx` — via `generateProjectSchema(project)` |

### No duplicate schema

Organization and WebSite are each emitted **exactly once** (root layout) and referenced everywhere else — WebPage's `isPartOf`/`about`, BlogPosting's `publisher`, CreativeWork's `creator` — via a plain `{ "@id": "https://brainstack.dev/#organization" }` pointer rather than a repeated full object. This is the schema.org-documented pattern for linking a graph across multiple JSON-LD blocks on a site without literal duplication, and it's the only pattern used throughout this implementation — there is no page that declares its own copy of the Organization or WebSite node.

### Article vs. BlogPosting — reviewed, BlogPosting kept

schema.org's `Article` has several subtypes: `NewsArticle`, `BlogPosting`, `TechArticle`, `Report`, `ScholarlyArticle`, and others. **BlogPosting is correct here, not generic Article:**
- It's schema.org's own guidance to use the most specific applicable subtype — this content genuinely is a company blog, not news or a scholarly report.
- Google's Article rich-result eligibility explicitly covers `Article`, `NewsArticle`, and `BlogPosting` **interchangeably** — using BlogPosting loses zero rich-result eligibility versus generic Article, while being more precise about what the content actually is.
- No case exists in this content model (10 blog posts, all editorial/opinion pieces from the Brain Stack team) that would call for `NewsArticle` or another subtype instead.

### Case study schema — CreativeWork, and why nothing more specific

Project/case-study pages (`/projects/[slug]`) needed their own review, since schema.org has **no dedicated "case study" type**. Candidates considered and rejected:

| Type considered | Why rejected |
|---|---|
| `Product` | Implies a price/availability/offer — none of these pages sell anything; they document work delivered for a client. |
| `SoftwareApplication` | Fits *some* projects (e.g. a SaaS platform) but not others (e.g. a real estate listings site, a B2B directory) — would be semantically wrong for a meaningful fraction of the 10 current projects, and inconsistent to apply selectively. |
| `Article`/`BlogPosting` | A case study isn't editorial content — misrepresents what the page is. |
| `CreativeWork` | **Used.** schema.org's own documentation describes this as the right fallback "when more specific types are not known" — and a case study genuinely is a generic creative/technical work, which is exactly what this type is for. |

**Being upfront about what this does and doesn't do:** `CreativeWork` does not unlock a dedicated Google Rich Results treatment — Google has no case-study-specific rich result, unlike `BlogPosting`/`Article` (which can earn article rich results) or `Product` (price/review stars). This is implemented anyway because it's valid, correctly-typed, standards-compliant structured data that helps any schema.org-consuming crawler understand the page — not because it unlocks a visible search feature. Per this phase's explicit instruction not to add schema "just for the sake of having more schema," this was the one type genuinely worth the (small) implementation cost; `Product`/`SoftwareApplication` were not implemented specifically because they'd be semantically wrong for part of the content.

### Escaping

`<JsonLd>` replaces every `<` in the serialized JSON with `<` before injecting it via `dangerouslySetInnerHTML`. This isn't defending against a known attack — Sheets content is edited by trusted team members, not the public — but blog titles and project names *are* CMS-editable strings outside strict developer control, and a stray `</script>` inside one would otherwise break out of the JSON-LD script tag and inject arbitrary markup into the page. One line of defense, applied once, in the one place all structured data is rendered.

### Validating without Google's Rich Results Test

This implementation wasn't validated against Google's live Rich Results Test tool (no network access to external validation services from this environment). Instead, every generated schema was checked by:
1. **Round-tripping through `JSON.parse`** against the actual rendered HTML output (`next build` output, then extracting each `<script type="application/ld+json">` block) — confirms syntactic validity, not just "looks right" in source.
2. **Manually checking required properties** for each type against schema.org's own property tables (`BlogPosting` requires `headline`; `CreativeWork` requires `name`; `BreadcrumbList` requires `itemListElement` with `position`/`name`/`item` on each entry) — all present.
3. **Checking for literal duplication** — confirmed no page emits the same `@type` twice, and Organization/WebSite appear in exactly one script tag site-wide (root layout only).

**Recommended follow-up, not done here:** paste a few live page URLs into [Google's Rich Results Test](https://search.google.com/test/rich-results) after the next deploy, to catch anything this environment's offline checks couldn't (e.g., Google-specific eligibility nuances beyond raw schema.org validity).

## Sitemap and robots

Neither exists. Both are small, mechanical additions given the slug-fetching logic already written for `generateStaticParams`:

```ts
// app/sitemap.ts — does not exist yet
import { getProjects } from "@/lib/utils/sheets/projects"
import { getBlogPosts } from "@/lib/utils/sheets/blog"
import { siteConfig } from "@/lib/metadata"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()])

  const staticRoutes = ["", "/about", "/services", "/projects", "/blog", "/contact"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }))

  const projectRoutes = projects.map((p) => ({
    url: `${siteConfig.url}/projects/${p.slug}`,
    lastModified: new Date(),
  }))

  const postRoutes = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: new Date(p.publishDate),
  }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
```

```ts
// app/robots.ts — does not exist yet
import { siteConfig } from "@/lib/metadata"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

## Canonical URLs

Every `pageMetadata` entry already includes an `alternates.canonical` field with the correct per-page URL — this is fixed automatically as a side effect of wiring `generateMetadata` per page (above). No separate work needed beyond that.

## Verification checklist

- [x] View source on `/about`, `/services`, `/projects`, `/blog`, `/contact` — confirm each has a distinct `<title>` and `<meta name="description">`, not the home page's. **Verified 2026-07-18 against the production build output.**
- [x] View source on one `/blog/[slug]` and one `/projects/[slug]` — confirm the OG image is the post/project's own image, not `siteConfig.ogImage`. **Verified 2026-07-18.**
- [ ] Paste a blog post URL into a social-share debugger (e.g. a Slack unfurl or Twitter Card Validator) — confirm the preview shows post-specific title/description/image. *(Requires a deployed URL — not yet done.)*
- [x] View source on any page with structured data — confirm a `<script type="application/ld+json">` block is present and `JSON.parse`-able. **Done 2026-07-18** — see §"Structured data (JSON-LD)" for the full implementation and how it was validated offline.
- [x] Fetch `/sitemap.xml` — confirm it lists all static routes plus every current project and blog slug. **Verified 2026-07-18 against the production build output.**
- [x] Fetch `/robots.txt` — confirm it references the sitemap and allows crawling. **Verified 2026-07-18.**
- [x] Delete the unused `seoMetadata`/`structuredDataScript` block from `lib/metadata.ts`. **Done 2026-07-18.**

See [`architecture-audit.md` §9](./architecture-audit.md#9-seo-audit) for why this is a P1 item and [`roadmap.md`](./roadmap.md) for time estimates.
