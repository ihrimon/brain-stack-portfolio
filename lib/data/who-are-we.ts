import type { ButtonLink, Stat } from "./shared-types"

// Content brief: SECTION 3 — "Who We Are" / About Block
export const whoWeAreData = {
  badge: "Who We Are",

  title: "A focused studio that builds\nproducts people actually use",

  description: [
    "Brain Stack is a small, senior team — two founders and a network of specialist engineers — working with ambitious founders and businesses across the US, UK, and Europe.",
    "We don't run large teams where your project gets handed to juniors. When you work with Brain Stack, you work directly with the people who built the products in our portfolio. That's how we stay fast, sharp, and accountable.",
    "We specialise in high-stakes digital products — fintech platforms, HIPAA-compliant healthcare systems, B2B marketplaces, and SaaS tools where security, compliance, and reliability aren't optional. Our team has shipped products handling real financial transactions and real patient data. When the stakes are too high for a no-code tool, that's when clients come to us.",
  ],

  cardTitle: "Build Digital Products, Delivered End-to-End",
  button: { label: "Discover More", href: "/#what-we-do" } satisfies ButtonLink,

  stats: [
    {
      value: "60",
      suffix: "+",
      label: "Products shipped",
      description: "Products shipped using modern, AI-assisted engineering",
    },
    {
      value: "12",
      suffix: "y",
      label: "Years",
      description: "Combined craft across mobile, web, cloud and AI",
    },
    {
      value: "40",
      suffix: "+",
      label: "Experts",
      description: "Top-tier engineers, designers and product experts",
    },
  ] satisfies Stat[],
} as const

export type WhoWeAreData = typeof whoWeAreData
