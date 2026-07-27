import type { IconName, ServiceOffering } from "./shared-types"

// Content brief: SECTION 5 — Services (homepage "What We Do" section).
// Distinct from lib/data/service-page.ts, which backs the dedicated
// /services page.
export const servicesData = {
  badge: "What We Do",

  title: "Everything you need to build and launch a digital product.",

  description:
    "Mobile apps, web platforms, AI tools, and everything in between — designed and built end to end by a senior team that has shipped live products across fintech, healthcare, e-commerce, and SaaS. We're the right fit if your product handles sensitive data, financial transactions, or operates in a regulated industry.",

  items: [
    {
      id: "01",
      slug: "branding",
      icon: "Palette" as IconName,
      title: "Branding",
      image: "/images/services/services-1.png",
      shortDescription:
        "Identity systems that make ambitious products instantly recognizable.",
      fullDescription:
        "We shape how a product looks, sounds and feels — logo, color, typography and voice — into a system your team can apply consistently from a landing page to a pitch deck, so the brand never outgrows the business.",
      technologies: ["Figma", "Brand Systems", "Motion Design"],
      items: [
        "Brand Strategy",
        "Naming & Positioning",
        "Logo & Identity",
        "Brand Messaging",
        "Visual Guidelines",
        "Design Systems",
      ],
      features: [
        "Visual identity design",
        "Brand guideline docs",
        "Design system foundations",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      featured: true,
      order: 1,
    },
    {
      id: "02",
      slug: "mobile-design",
      icon: "Smartphone" as IconName,
      title: "Mobile Design",
      image: "/images/services/services-2.png",
      shortDescription:
        "Native-feeling app experiences designed for iOS and Android.",
      fullDescription:
        "We design mobile products from wireframe to pixel-perfect UI, balancing platform conventions with your brand, so the app feels considered on every screen size and OS version.",
      technologies: ["Figma", "iOS HIG", "Material Design"],
      items: [
        "UX Research & Flows",
        "UI Design",
        "iOS & Android Apps",
        "Interactive Prototypes",
        "Design Systems",
        "App Store Assets",
      ],
      features: [
        "UX research & flows",
        "High-fidelity UI kits",
        "Interactive prototypes",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 2,
    },
    {
      id: "03",
      slug: "digital-marketing",
      icon: "Megaphone" as IconName,
      title: "Digital Marketing",
      image: "/images/services/services-3.png",
      shortDescription:
        "Growth strategy and campaigns that turn traffic into customers.",
      fullDescription:
        "We plan and run the campaigns that get a product in front of the right audience — SEO, paid, content and lifecycle marketing — tied back to the metrics that actually move the business.",
      technologies: ["SEO", "Paid Media", "Analytics"],
      items: [
        "SEO & Content Strategy",
        "Paid Media",
        "Social Media Marketing",
        "Email & Lifecycle",
        "Analytics & Reporting",
        "Conversion Optimization",
      ],
      features: [
        "Growth strategy",
        "Campaign management",
        "Performance reporting",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 3,
    },
    {
      id: "04",
      slug: "brand-guideline",
      icon: "BookOpen" as IconName,
      title: "Brand Guideline",
      image: "/images/services/services-4.png",
      shortDescription:
        "Documented systems that keep every team on-brand at scale.",
      fullDescription:
        "We turn a brand identity into a living reference — logo usage, color, type, imagery and tone — so designers, marketers and partners can all build on it without drifting off-brand.",
      technologies: ["Notion", "Figma", "Style Guides"],
      items: [
        "Logo Usage Rules",
        "Color & Typography",
        "Voice & Tone",
        "Asset Libraries",
        "Style Guide Docs",
        "Team Onboarding",
      ],
      features: [
        "Usage documentation",
        "Asset libraries",
        "Team onboarding",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 4,
    },
    {
      id: "05",
      slug: "web-development",
      icon: "Code2" as IconName,
      title: "Web Development",
      image: "/images/services/services-5.png",
      shortDescription:
        "Fast, scalable web products built with modern engineering.",
      fullDescription:
        "We build and ship production web applications — from marketing sites to complex SaaS platforms — with the performance, accessibility and architecture to grow with the business.",
      technologies: ["Next.js", "TypeScript", "Cloud Infrastructure"],
      items: [
        "Frontend Development",
        "Backend Development",
        "Full-Stack Solutions",
        "API Integration",
        "Cloud Infrastructure",
        "Performance Optimization",
      ],
      features: [
        "Full-stack development",
        "API & cloud architecture",
        "Performance optimization",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 5,
    },
  ] satisfies ServiceOffering[],
} as const

export type ServicesData = typeof servicesData
