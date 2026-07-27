import type { Testimonial } from "./shared-types"

// Content brief: SECTION 8 — Testimonials.
// No real client testimonials are available yet. Keep the section wired
// into the Sheets CMS fallback (see lib/utils/sheets/home.ts) with an empty
// item list so it can be reinstated by adding real quotes here later —
// see docs/brainstack-website-content-brief.md Section 8.
export const testimonialsData = {
  badge: "Testimonial",
  title: "What Our Clients Say About Working With Us",
  description: "Transforming ideas into memorable digital experiences.",
  items: [] as Testimonial[],
} as const

export type TestimonialsData = typeof testimonialsData
