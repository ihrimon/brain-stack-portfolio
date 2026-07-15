/**
 * Shared shapes reused across every page's data file (home, about, service,
 * projects, blog). Keeping these in one place is what lets a single Google
 * Sheet column convention (plain cell vs JSON-in-cell) apply consistently
 * across HomeSheet / AboutSheet / ServicesSheet / ProjectsSheet / BlogSheet.
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
