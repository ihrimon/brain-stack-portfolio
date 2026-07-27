import type { ButtonLink } from "./shared-types"

// Content brief: SECTION 12 — Contact Section (homepage CTA banner, above
// the actual contact form). See lib/constants/contact.ts for the contact
// form's own copy (email, address, socials).
export const ctaData = {
  title: "Let's Build Something Amazing Together",
  description:
    "Tell us about your project. We'll respond within one business day with a clear, honest take on scope, timeline, and how we'd approach it.",
  button: { label: "Book a Call", href: "/#contact" } satisfies ButtonLink,
} as const

export type CtaData = typeof ctaData
