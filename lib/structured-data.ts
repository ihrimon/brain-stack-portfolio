/**
 * schema.org JSON-LD generators. Deliberately separate from lib/metadata.ts
 * (which owns the Next.js Metadata API — <title>/<meta>/OG tags): this file
 * is a distinct concern with a distinct audience (structured-data consumers
 * like Google's Rich Results parser, not the browser tab or a social-share
 * unfurl). Render via the <JsonLd> component (components/common/JsonLd.tsx),
 * never by hand-building a <script> tag at a call site.
 *
 * Every node that can be referenced from more than one place (Organization,
 * WebSite) is emitted exactly once — from generateGlobalSchema(), rendered
 * once in the root layout — and referenced everywhere else via a plain
 * `{ "@id": ... }` pointer. This is the schema.org-recommended way to link a
 * graph across multiple JSON-LD blocks on a site without literally
 * duplicating the same Organization/WebSite object on every page.
 */

import { contactData } from "./constants/contact"
import type { BlogPost } from "./data/blog-page"
import type { Project } from "./data/projects"
import { pageMetadata, siteConfig } from "./metadata"

const ORGANIZATION_ID = `${siteConfig.url}/#organization`
const WEBSITE_ID = `${siteConfig.url}/#website`

/**
 * schema.org `image`/`logo` fields require absolute URLs. Every image in
 * this app is either an already-absolute remote URL (Cloudinary, ibb.co)
 * or a local `/images/...` path — this resolves either to a full URL.
 */
function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`
}

/** The Organization node — rendered once, referenced everywhere else by `@id`. */
export function generateOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: toAbsoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    sameAs: contactData.socials.map((social) => social.href),
    contactPoint: {
      "@type": "ContactPoint",
      email: contactData.email,
      telephone: contactData.phone,
      contactType: "customer support",
    },
  }
}

/** The WebSite node — rendered once, referenced everywhere else by `@id`. */
export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": ORGANIZATION_ID },
    // No `potentialAction`/SearchAction: this site has no search feature —
    // no /search route, no search input anywhere in the app. A SearchAction
    // describes a capability that has to actually exist to be valid; adding
    // one here would be exactly the "schema for the sake of schema" this
    // pass is explicitly scoped to avoid.
  }
}

/** Rendered once in the root layout — the only place Organization/WebSite are emitted. */
export function generateGlobalSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [generateOrganizationSchema(), generateWebSiteSchema()],
  }
}

/** One per static page (Home/About/Services/Projects/Blog/Contact) — reuses the same source of truth as generateMetadata. */
export function generateWebPageSchema(page: keyof typeof pageMetadata) {
  const meta = pageMetadata[page]
  const url = meta.alternates.canonical

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

/** Not rendered with its own `@context` — always nested inside a page's `@graph` alongside BlogPosting/CreativeWork. */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * BlogPosting, not generic Article — schema.org's own guidance is to use
 * the most specific applicable subtype, and Google's Article rich-result
 * eligibility explicitly covers Article/NewsArticle/BlogPosting
 * interchangeably, so this loses no rich-result eligibility while being
 * more precise about what this content actually is (a company blog post,
 * not news). See docs/seo-strategy.md for the full comparison.
 */
export function generateBlogPostingSchema(post: BlogPost) {
  const url = `${siteConfig.url}/blog/${post.slug}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#blogposting`,
        headline: post.title,
        description: post.excerpt,
        image: toAbsoluteUrl(post.featuredImage),
        datePublished: post.publishDate,
        // No separate "last updated" field exists in the content model —
        // honest to reuse publishDate here rather than invent a value.
        dateModified: post.publishDate,
        author: {
          "@type": "Person",
          name: post.author,
        },
        publisher: { "@id": ORGANIZATION_ID },
        mainEntityOfPage: { "@id": `${url}#webpage` },
        keywords: post.tags.join(", "),
        url,
        isPartOf: { "@id": WEBSITE_ID },
      },
      generateBreadcrumbSchema([
        { name: "Home", url: siteConfig.url },
        { name: "Blog", url: `${siteConfig.url}/blog` },
        { name: post.title, url },
      ]),
    ],
  }
}

/**
 * CreativeWork, not Product/Article/SoftwareApplication — see
 * docs/seo-strategy.md for the full "what schema fits a case study" review.
 * Short version: schema.org has no dedicated case-study type; CreativeWork
 * is the type schema.org itself documents as the right fallback "when more
 * specific types are not known," and every alternative considered was
 * semantically wrong for at least some of the 10 projects (Product implies
 * a price/availability that doesn't exist; SoftwareApplication doesn't fit
 * projects that are marketing sites, not installable software; Article
 * misrepresents a case study as editorial content). This does not unlock a
 * dedicated Google rich-result treatment — Google has no case-study rich
 * result — but it's valid, correctly-typed structured data regardless.
 */
export function generateProjectSchema(project: Project) {
  const url = `${siteConfig.url}/projects/${project.slug}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#creativework`,
        name: project.title,
        description: project.overview,
        image: toAbsoluteUrl(project.heroImage),
        url,
        creator: { "@id": ORGANIZATION_ID },
        about: project.industry,
        keywords: project.technologies.join(", "),
        ...(project.date ? { dateCreated: project.date } : {}),
      },
      generateBreadcrumbSchema([
        { name: "Home", url: siteConfig.url },
        { name: "Projects", url: `${siteConfig.url}/projects` },
        { name: project.title, url },
      ]),
    ],
  }
}
