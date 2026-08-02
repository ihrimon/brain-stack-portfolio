import type { ButtonLink } from "./shared-types"

// Content brief: SECTION 12 — Contact Section (homepage CTA banner, above
// the actual contact form). See lib/constants/contact.ts for the contact
// form's own copy (email, address, socials).
export const ctaData = {
  title: "Let's Build Something Amazing Together",
  description:
    "Tell us what you're building and who it's for. We work best with founders and businesses in fintech, healthcare, SaaS, and regulated industries. We'll get back within 24 hours - honest assessment, no pitch, no obligation.",
  button: { label: "Book a Call", href: "/#contact" } satisfies ButtonLink,
} as const

export type CtaData = typeof ctaData
