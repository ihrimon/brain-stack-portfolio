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
  label: string
}

export const heroMetrics = [
  { value: 5, suffix: "+", label: "Products Shipped" },
  { value: 4, suffix: "+", label: "Years Combined Experience" },
  { value: 2, suffix: "", label: "Founders" },
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

export const heroTagline =  ["Discover", "Design", "Develop", "Automate"] as const

export type HeroWorkflowData = typeof heroWorkflow
export type HeroMetricsData = typeof heroMetrics
export type HeroReviewsData = typeof heroReviews
export type HeroTaglineData = typeof heroTagline
