/**
 * Shared shapes reused across every page's data file (home, about, service,
 * projects, blog). Keeping these in one place lets equivalent concepts
 * (a stat, a testimonial, a section header) stay consistent across pages.
 */

export interface ButtonLink {
  label: string
  href: string
}

export interface Stat {
  label: string
  value: string
  suffix?: string
  description?: string
}

export interface Testimonial {
  name: string
  role?: string
  company?: string
  title?: string
  quote: string
  highlight?: string
  rating?: number
  image: string
}

/** Lucide icon name, e.g. "Blocks". Resolved to a component via lib/utils/icons.ts. */
export type IconName = string

/**
 * Standard section intro — badge/title/description recur identically across
 * almost every section file. Section data types can spread/extend this
 * instead of redeclaring the same three fields with slightly different
 * optionality each time.
 */
export interface SectionHeader {
  badge?: string
  title: string
  description?: string
}

/**
 * One ordered stage in any "how it works" / "our process" / "our approach"
 * section. Unifies what used to be three incompatible shapes:
 * aboutApproachData's `{title, items}`, serviceProcessData's
 * `{title, description}`, and home's processData `{icon,title,description,tags}`.
 * A given usage populates only the optional fields it needs.
 */
export interface ProcessStep {
  title: string
  /** Prose-driven step. */
  description?: string
  /** Bullet-driven step. */
  items?: string[]
  icon?: IconName
  tags?: string[]
  /** Short timeframe badge, e.g. "1-2 Weeks". Timeline-diagram usages only
   *  (e.g. home's processData) — most ProcessStep consumers leave this unset. */
  duration?: string
}

/**
 * One card in any feature/benefit grid (e.g. whyChooseUsData). One shape,
 * optional fields let each usage populate only what it needs.
 */
export interface FeatureCard {
  icon?: IconName
  image?: string
  title: string
  description?: string
  items?: string[]
  metric?: string
  metricLabel?: string
}

/**
 * One service/offering tile. Unifies home's servicesData.items,
 * serviceSpotlightData, and exclusiveServicesData's category tiles — three
 * shapes that previously all meant "a service we offer" with different
 * fields each time.
 */
export interface ServiceOffering {
  /** Display index (e.g. "01"), not a stable identity — optional, only used
   *  by sections that render a numbered list. */
  id?: string
  /** URL-safe identifier, e.g. for a `/services#slug` anchor. */
  slug?: string
  icon?: IconName
  image?: string
  title: string
  subtitle?: string
  description?: string
  /** One-line summary for compact/featured presentations. */
  shortDescription?: string
  /** Longer prose for a dedicated detail view. */
  fullDescription?: string
  tags?: string[]
  items?: string[]
  /** Tools/stack associated with this service. */
  technologies?: string[]
  /** Bullet-point capabilities, distinct from `items` (kept generic above). */
  features?: string[]
  buttonLabel?: string
  buttonHref?: string
  featured?: boolean
  order?: number
}

/** A single question/answer pair, used by the homepage FAQ section. */
export interface FAQItem {
  question: string
  answer: string
}
