import type { ButtonLink, FeatureCard, ProcessStep, Stat } from "./shared-types"

export const aboutMissionData = {
  image: "/images/services/services-1.png",
  title: "Turning Vision Into Reality",

  statement: {
    title: "Our Mission",
    description:
      "To turn ambitious ideas into software that ships — combining sharp product thinking, modern tooling, and AI-assisted engineering to build digital experiences that inspire action and create lasting impact.",
    highlights: ["digital experiences", "businesses", "high-performance digital solutions"],
  },

  // Renamed from `approach` — the mission section's short list of guiding
  // principles is a distinct concept from the page-level "Engineering
  // Approach" section (aboutApproachData below); sharing the name "approach"
  // made the two easy to confuse when reading the data file.
  pillars: {
    title: "Our Approach",
    items: [
      "Clear and focused strategy",
      "Design that drives impact",
      "Collaboration without the chaos",
      "Outcomes that build momentum",
      "Smart solutions, tailored for you",
    ],
  },
} as const

export const aboutStatsData = [
  { value: "60", suffix: "+", label: "Products Shipped" },
  { value: "40", suffix: "+", label: "Global Clients" },
  { value: "12", suffix: "+", label: "Years Combined Experience" },
  { value: "97", suffix: "%", label: "Client Satisfaction" },
] satisfies Stat[]

export const aboutFeaturesData = {
  plan: {
    title: "Flexible Engagements",
    description: "Get premium engineering without premium overhead.",
    note: "Pause & resume anytime",
  },
  rating: {
    stars: 5,
    title: "Happy Clients Worldwide",
    count: "40+",
    score: "4.9+",
    avatars: [
      "/images/testimonials/customer-1.webp",
      "/images/testimonials/customer-2.webp",
      "/images/testimonials/customer-3.webp",
      "/images/testimonials/customer-4.webp",
    ],
  },
  strategy: {
    title: "Strategic solutions for lasting impact",
    items: [
      "Tailored strategy",
      "High-quality output",
      "Timely delivery",
      "Transparent process",
      "Post-launch support",
    ],
    button: { label: "View All Projects", href: "/projects" } satisfies ButtonLink,
  },
  support: {
    title: "24/7",
    subtitle: "Always on Support",
    message: "How can I help you?",
  },
  reliable: {
    title: "Reliable & Future-ready",
  },
  stack: {
    title: "Built With The Best",
    description: "Access the latest tools, fully integrated and ready to go.",
    tools: ["React", "Next.js", "Node.js", "OpenAI", "AWS", "Docker"],
  },
} as const

export const aboutApproachData = {
  badge: "Engineering Approach",
  title: "Method of making better results",
  // Renamed from `steps` — every other "ordered stage list" in the data
  // layer (home's processData, service-page's serviceProcessData) uses
  // `items`, so this one matches instead of being the one exception.
  items: [
    {
      title: "Problem Discovery",
      items: [
        "Usability Studies",
        "User Interviews",
        "Stakeholder Interviews",
        "Competitive Research",
        "Insights Report",
        "User Journey",
      ],
    },
    {
      title: "Design System Ready",
      items: [
        "Thinking Workshops",
        "Sitemaps",
        "Concepts",
        "Designs",
        "Prototypes",
        "Usability Studies",
      ],
    },
    {
      title: "Design Implementation",
      items: [
        "Design",
        "Use Cases",
        "User Flows",
        "Various User Types",
        "Annotations",
        "Interactions",
      ],
    },
    {
      title: "Testing & Handover",
      items: [
        "QA Testing",
        "Performance Audit",
        "Documentation",
        "Client Training",
        "Launch Checklist",
        "Post-Launch Support",
      ],
    },
  ] satisfies ProcessStep[],
} as const

export const aboutInquiryData = {
  title: "Have a project idea in mind? Let's get started",
} as const

/** Currently not rendered by any page component — preserved as-is for a future "Why Choose Us" section. */
export const whyChooseUsData = {
  badge: "Why Brain Stack",
  title: "Engineering You Can Actually Rely On",
  description:
    "We're not a resourcing agency. We're a senior engineering team that treats your product like our own — with the technical judgment to prove it.",
  // Renamed from `points` to match the `items` convention used for every
  // other repeating list in the data layer.
  items: [
    {
      title: "Experienced Team",
      description:
        "Senior engineers and designers with 6+ years average experience across startups and enterprises.",
      metric: "150+",
      metricLabel: "Projects Delivered",
    },
    {
      title: "Modern Technology",
      description:
        "Current stacks, not legacy patterns — React, Next.js, and cloud-native infrastructure by default.",
      metric: "99.9%",
      metricLabel: "Uptime Delivered",
    },
    {
      title: "Transparent Process",
      description:
        "Weekly demos, open roadmaps, and direct access to the engineers building your product — no black boxes.",
      metric: "100%",
      metricLabel: "Client Visibility",
    },
    {
      title: "Agile Development",
      description:
        "Two-week sprints with shippable increments, so you see progress constantly, not just at the end.",
      metric: "2 Week",
      metricLabel: "Sprint Cycles",
    },
    {
      title: "Fast Delivery",
      description:
        "MVPs in weeks, not quarters — without sacrificing the architecture you'll need to scale later.",
      metric: "6 Weeks",
      metricLabel: "Avg. MVP Timeline",
    },
    {
      title: "Long-Term Support",
      description:
        "Most clients stay with us past launch — for good reason. Ongoing support plans built around your roadmap.",
      metric: "30min",
      metricLabel: "Support Response Time",
    },
    {
      title: "Innovation",
      description:
        "AI-assisted development, continuous exploration of new tooling, and a bias toward the modern approach.",
      metric: "12+",
      metricLabel: "Countries Served",
    },
  ] satisfies FeatureCard[],
} as const

export const teamMembersData = {
  badge: "Team Members",
  title: "Meet The Creative Team Members",
  description:
    "We're a team of strategic digital marketers working globally with the largest brands, We believe that progress only happens when you refused to play things safe.",

  members: [
    {
      name: "David William",
      role: "Marketing Manager",
      image: "/images/team/team-1.webp",
    },
    {
      name: "Samantha Rivera",
      role: "Marketing Manager",
      image: "/images/team/team-2.webp",
    },
    {
      name: "Marcus Chen",
      role: "Marketing Manager",
      image: "/images/team/team-3.webp",
    },
    {
      name: "Elena Garcia",
      role: "Marketing Manager",
      image: "/images/team/team-4.webp",
    },
    {
      name: "Priya Sharma",
      role: "Product Designer",
      image: "/images/team/team-1.webp",
    },
    {
      name: "Daniel Kim",
      role: "Software Engineer",
      image: "/images/team/team-2.webp",
    },
    {
      name: "Olivia Bennett",
      role: "UX Researcher",
      image: "/images/team/team-3.webp",
    },
    {
      name: "Ahmed Hassan",
      role: "Brand Strategist",
      image: "/images/team/team-4.webp",
    },
  ],
} as const

export type AboutMissionData = typeof aboutMissionData
export type AboutStatsData = typeof aboutStatsData
export type AboutFeaturesData = typeof aboutFeaturesData
export type AboutApproachData = typeof aboutApproachData
export type AboutInquiryData = typeof aboutInquiryData
export type WhyChooseUsData = typeof whyChooseUsData
export type TeamMembersData = typeof teamMembersData
