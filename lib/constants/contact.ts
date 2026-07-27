export const contactData = {
  email: "contact.brainstack@gmail.com",
  phone: "+1 (315) 272 7994",
  phoneHours: "Call 24/7 Hours",
  address: {
    line1: "London · New York · Dhaka",
  },
  socials: [
    { label: "X", glyph: "X", href: "https://x.com/brainstack" },
    {
      label: "LinkedIn",
      glyph: "in",
      href: "https://linkedin.com/company/brainstack",
    },
    { label: "GitHub", glyph: "gh", href: "https://github.com/brainstack" },
    {
      label: "Instagram",
      glyph: "ig",
      href: "https://instagram.com/brainstack",
    },
  ],
  serviceOptions: [
    "Branding",
    "Mobile Design",
    "Digital Marketing",
    "Web Development",
    "AI & Automation",
  ],
  budgetOptions: ["$5k - $15k", "$15k - $50k", "$50k - $100k", "$100k+"],
} as const

// Shared between ContactForm.tsx (client-side pre-check) and
// lib/actions/contact.ts (server-side enforcement) — kept comfortably
// under Gmail's ~25MB post-send attachment cap even after MIME base64
// encoding inflates the raw file by roughly a third.
export const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024
