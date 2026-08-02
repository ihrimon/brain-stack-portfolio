import type { ButtonLink } from "./shared-types"

export const heroBannerData = {
  badge: "Creative Design Agency",

  title:
    ["We build digital products that grow your business", "We build websites that AI can't be trusted to build"],

  highlight: ["Business", "Trusted"],

  description:
    "Secure, production-grade digital products for businesses where failure isn't an option. Fintech, healthcare, SaaS, and regulated industries — built by engineers, not AI generators.",

  button: {
    label: "Start a project",
    href: "/contact",
  } satisfies ButtonLink,

  secondaryButton: {
    label: "View our work",
    href: "/projects",
  } satisfies ButtonLink,
} as const

export interface HeroWorkflowStep {
  label: string
  status: "READY" | "RUNNING" | "OPTIMIZING" | "DEPLOYED"
}

export const heroWorkflow = [
  { label: "Research", status: "READY" },
  { label: "Design", status: "RUNNING" },
  { label: "Development", status: "RUNNING" },
  { label: "AI Automation", status: "OPTIMIZING" },
  { label: "Launch", status: "DEPLOYED" },
] satisfies HeroWorkflowStep[]

export interface HeroMetric {
  value: number
  suffix: string
  /** Short caption shown inline with the value, e.g. "Products Shipped". */
  title: string
  /** Longer descriptive line shown below the value/title. */
  label: string
}

// Content brief: SECTION 2 — Stats / Numbers Strip
export const heroMetrics = [
  {
    value: 5,
    suffix: "+",
    title: "Products Shipped",
    label: "Products shipped using modern, AI-assisted engineering",
  },
  {
    value: 4,
    suffix: "+",
    title: "Years",
    label: "Combined craft across mobile, web, cloud and AI",
  },
  {
    value: 2,
    suffix: "",
    title: "Founders",
    label: "Senior engineers and product leaders, hands-on every project",
  },
] satisfies HeroMetric[]

export interface HeroReviewAvatar {
  src: string
  alt: string
}

export const heroReviews = {
  avatars: [
    { src: "/images/testimonials/customer-1.webp", alt: "" },
    { src: "/images/testimonials/customer-2.webp", alt: "" },
    { src: "/images/testimonials/customer-3.webp", alt: "" },
  ],
  rating: 5,
  ratingLabel: "Clutch Rating",
  trustedBy: "Trusted by startups & businesses worldwide",
} as const

export const heroTagline = ["Discover", "Design", "Develop", "Automate"] as const

export type HeroBannerData = typeof heroBannerData
export type HeroWorkflowData = typeof heroWorkflow
export type HeroMetricsData = typeof heroMetrics
export type HeroReviewsData = typeof heroReviews
export type HeroTaglineData = typeof heroTagline
