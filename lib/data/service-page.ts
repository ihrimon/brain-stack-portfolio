import type { ButtonLink, IconName, ProcessStep, ServiceOffering } from "./shared-types"

export const serviceSpotlightData = [
  {
    title: "We make design that lead and inspire.",
    subtitle: "Struggling to make your brand instantly recognizable?",
    description:
      "We shape a distinct visual identity and voice that makes your brand impossible to confuse with anyone else's — built to hold up across every touchpoint.",
    tags: ["Strategy", "Identity Design", "Guidelines", "Positioning"],
    image: "/images/services/services-1.png",
  },
  {
    title: "Mobile Design",
    subtitle: "Is your app losing users before they finish onboarding?",
    description:
      "We design mobile experiences people actually want to open again — fast, intuitive flows backed by real usability testing, not guesswork.",
    tags: ["UX Research", "UI Design", "Prototyping", "Usability Testing"],
    image: "/images/services/services-2.png",
  },
  {
    title: "Digital Marketing",
    subtitle: "Struggling to turn traffic into paying customers?",
    description:
      "We build growth systems around your product — SEO, content, and paid channels working together instead of competing for the same budget.",
    tags: ["SEO", "Paid Media", "Content", "Analytics"],
    image: "/images/services/services-3.png",
  },
  {
    title: "Brand Guideline",
    subtitle: "Are you having trouble explaining your brand story?",
    description:
      "Together we build a strong brand with which you make a distinctive impression on your target group and claim a powerful position in the market.",
    tags: [
      "Strategy",
      "Brand Identity",
      "Research",
      "Consultation",
      "Communication",
    ],
    image: "/images/services/services-4.png",
  },
  {
    title: "Web Development",
    subtitle: "Is your website holding your business back?",
    description:
      "We engineer fast, scalable web products — from marketing sites to full-stack platforms — built on modern tooling and shipped without the usual delays.",
    tags: ["Next.js", "Full-Stack", "Performance", "SEO"],
    image: "/images/services/services-5.png",
  },
] as const satisfies ServiceOffering[]

export const serviceProcessData = {
  badge: "We follow a proven working process",
  title:
    "We help ambitious teams build software that performs where people live and work",
  // Renamed from `steps` to match the `items` convention used across every
  // other ordered-stage list in the data layer.
  items: [
    {
      title: "Discovery & Research",
      description:
        "We start by understanding your users, business goals, and constraints — so every decision that follows is grounded in something real.",
    },
    {
      title: "Wireframing & Prototyping",
      description:
        "Ideas take shape fast. We map flows and test structure early, before a single line of production code gets written.",
    },
    {
      title: "Design System & Mockup",
      description:
        "A consistent design language comes together — components, type, color and motion — ready to scale across every screen.",
    },
    {
      title: "Development & Engineering",
      description:
        "Senior engineers turn approved designs into production-grade code, built for performance, security and long-term maintainability.",
    },
    {
      title: "Launch & Support",
      description:
        "We ship, monitor, and stay close after launch — fixing, refining and scaling the product as real usage comes in.",
    },
  ] satisfies ProcessStep[],
} as const

export const exclusiveServicesData = {
  badge: "Exclusive Services",
  title: "Our exclusive services",
  description:
    "We bet on products that shift categories and add real value to people's lives — and on founders who are motivated to build something that lasts.",
  // Renamed from `categories` to match the `items` convention; each entry is
  // a ServiceOffering (icon + title + a sub-bullet list), the same shape
  // used for every other "list of service tiles" in the data layer.
  items: [
    {
      icon: "Layers" as IconName,
      title: "UX/UI Design",
      items: [
        "User Research",
        "Wireframing",
        "Prototyping",
        "Interaction Design",
        "Usability Testing",
        "Design Systems",
        "Accessibility",
      ],
    },
    {
      icon: "Palette" as IconName,
      title: "Branding & Identity",
      items: [
        "Brand Strategy",
        "Logo & Identity",
        "Visual Guidelines",
        "Typography",
        "Brand Voice",
        "Packaging",
        "Style Guides",
      ],
    },
    {
      icon: "Code2" as IconName,
      title: "Web & App Development",
      items: [
        "Front-end Development",
        "Back-end Development",
        "API Integration",
        "Website & Mobile App",
        "iOS + Android",
        "Performance Tuning",
        "QA & Testing",
      ],
    },
    {
      icon: "Bot" as IconName,
      title: "AI & Automation",
      items: [
        "LLM Integration",
        "Workflow Automation",
        "AI Agents",
        "Data Pipelines",
        "Predictive Models",
        "Cloud Infrastructure",
        "Monitoring & Support",
      ],
    },
  ] satisfies ServiceOffering[],
} as const

export const agencyBannerData = {
  title: "We're a simple but pro-level studio",
  descriptionBefore: "You get direct access to ",
  highlight: "senior engineers and designers",
  descriptionAfter:
    " — no static hand-offs, no bloated teams, no wasted cycles between idea and production.",
  button: { label: "Learn More", href: "/contact" } satisfies ButtonLink,
  image: "/images/services/services-1.png",
} as const

export type ServiceSpotlightData = typeof serviceSpotlightData
export type ServiceProcessData = typeof serviceProcessData
export type ExclusiveServicesData = typeof exclusiveServicesData
export type AgencyBannerData = typeof agencyBannerData
