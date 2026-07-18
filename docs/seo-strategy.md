# Brain Stack — SEO Implementation Guide

**Status:** ✅ Per-page metadata, sitemap, and robots implemented and verified 2026-07-18 — see the "Implemented" callouts inline below. Structured data (JSON-LD) remains outstanding (P2). See [`architecture-audit.md` §9](./architecture-audit.md#9-seo-audit) for the full status table.

---

## Current state (as of 2026-07-18)

All 7 routes now export real metadata via `generateMetadata`/`metadata`, sourced from `lib/metadata.ts`. `app/sitemap.ts` and `app/robots.ts` exist and were confirmed in the production build output. The sections below were originally written as a remediation guide before any of this was implemented — they're kept as-is (with "Implemented" notes added) since they now double as the record of what was actually built and why, for anyone touching this code later.

**Previously:** only `app/layout.tsx` set `metadata` (via `defaultMetadata`), so every route rendered with the identical `<title>`, description, and OG image as the home page. This section is left for historical context on what the gap was.

**What existed in `lib/metadata.ts` before this fix, and is now wired up:**

```ts
// lib/metadata.ts
export const pageMetadata = { home: {...}, about: {...}, blog: {...}, services: {...}, projects: {...}, contact: {...} }
export function generatePageMetadata(page: keyof typeof pageMetadata, custom?: Partial<Metadata>): Metadata
export function generateBlogPostMetadata(title, description, publishedTime, slug, image?): Metadata
export function generateProjectMetadata(title, description, slug, image?): Metadata   // added 2026-07-18
export function generateBlogPostStructuredData(title, description, publishedTime, slug, author?)  // still unused — P2
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

`generateBlogPostStructuredData` and the `Organization` schema in `pageMetadata.about.structuredData` are fully written and never rendered. Once metadata is wired (above), add a `<script>` tag alongside it:

```tsx
// In app/blog/[slug]/page.tsx, inside the returned JSX
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      generateBlogPostStructuredData(post.title, post.excerpt, post.publishDate, post.slug, post.author)
    ),
  }}
/>
```

Same pattern applies to the `Organization` schema — render it once, likely in `app/layout.tsx` or `app/about/page.tsx`, not per-page.

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
- [ ] View source on any page with structured data — confirm a `<script type="application/ld+json">` block is present and `JSON.parse`-able. *(JSON-LD rendering is still P2 — not yet implemented.)*
- [x] Fetch `/sitemap.xml` — confirm it lists all static routes plus every current project and blog slug. **Verified 2026-07-18 against the production build output.**
- [x] Fetch `/robots.txt` — confirm it references the sitemap and allows crawling. **Verified 2026-07-18.**
- [x] Delete the unused `seoMetadata`/`structuredDataScript` block from `lib/metadata.ts`. **Done 2026-07-18.**

See [`architecture-audit.md` §9](./architecture-audit.md#9-seo-audit) for why this is a P1 item and [`roadmap.md`](./roadmap.md) for time estimates.
