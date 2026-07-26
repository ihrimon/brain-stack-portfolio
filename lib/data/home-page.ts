import type {
  ButtonLink,
  IconName,
  ProcessStep,
  ServiceOffering,
  Stat,
  Testimonial,
} from "./shared-types"

export const heroBannerData = {
  badge: "Creative Design Agency",

  title:
    "We build digital products that grow your business. We build websites that AI can't be trusted to build",

  // Rendered in italic + accent color within the title above — must be an
  // exact substring of `title`.
  highlight: "grow your business",

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

  review: {
    label: "Review on Clutch",
    rating: 5,
  },
} as const

export const projectVideoData = {
  badge: "Watch Our Work",

  title: "A Closer Look At How We Build Products",

  description:
    "From first sprint to final launch, we work as an extension of your team — shipping fast without cutting corners. Here's a quick look at how we turn ideas into shipped software.",

  primaryButton: { label: "View Our Work", href: "/projects" } satisfies ButtonLink,
  secondaryButton: { label: "See Our Process", href: "/about" } satisfies ButtonLink,
} as const

export const whoWeAreData = {
  badge: "Who We Are",

  title: "A focused studio that builds products people actually use.",

  description: [
    "Brain Stack is a small, senior team — two founders and a network of specialist engineers — working with ambitious founders and businesses across the US, UK, and Europe.",
    "We don't run large teams where your project gets handed to juniors. When you work with Brain Stack, you work directly with the people who built the products in our portfolio. That's how we stay fast, sharp, and accountable.",
    "We specialise in high-stakes digital products — fintech platforms, HIPAA-compliant healthcare systems, B2B marketplaces, and SaaS tools where security, compliance, and reliability aren't optional. Our team has shipped products handling real financial transactions and real patient data. When the stakes are too high for a no-code tool, that's when clients come to us.",
  ],

  cardTitle: "Build Digital Products, Delivered End-to-End",
  button: { label: "Discover More", href: "/#services" } satisfies ButtonLink,

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

export const foundersData = {
  badge: "The Team",

  title: "Built by founders, run by founders.",

  description:
    "Two senior builders and a trusted network of specialist contractors. Every project runs through us directly — no account managers, no hand-offs.",

  members: [
    {
      name: "Jakir Uddin",
      title: "Founder & CTO",
      initials: "JU",
      bio: "Senior Full-Stack Engineer with 4+ years building production-grade mobile and web products across fintech, healthcare, and AI. He architects the systems, writes the code, and ensures every product ships clean, scalable, and maintainable.",
      linkedin: "https://linkedin.com/in/jakir-uddin-jahid",
      skills: [
        "Flutter",
        "React Native",
        "Next.js",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "AWS",
        "Firebase",
        "OpenAI API",
      ],
    },
    {
      name: "Kyaw Munn Oo",
      title: "Co-Founder",
      initials: "KMO",
      bio: "Leads the business, client relationships, and growth side of Brain Stack. His background spans product strategy, sales, marketing, and content. He's the person who understands your business problem before it becomes a product brief.",
      linkedin: "https://linkedin.com/in/kyawmunn",
      skills: ["Product Strategy", "Sales & BD", "Content & Growth Marketing"],
    },
  ],

  footnote:
    "We work with a trusted network of senior contractors — developers, designers, and AI specialists — brought in for specific project needs.",
} as const

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

export const processData = {
  badge: "How We Engineer",

  title: "How we work.",

  description:
    "No surprises. No hand-offs to juniors. The same two people who scoped your project build it and deliver it.",

  items: [
    {
      icon: "Search" as IconName,
      title: "Discovery",
      description:
        "We start with your business, not your brief. We ask what you're actually trying to solve, who uses it, and what success looks like in 90 days. We ask the straightforward questions before a line of code is written. Output: clear scope, tech recommendation, fixed timeline, and fixed price.",
      tags: ["Scoping", "Fixed Price", "Fixed Timeline"],
    },

    {
      icon: "PencilLine" as IconName,
      title: "Design",
      description:
        "Before we build, we map. Wireframes, user flows, and architecture decisions get agreed here. You review and approve everything before development starts. No surprises halfway through.",
      tags: ["Wireframes", "User Flows", "Architecture"],
    },

    {
      icon: "Blocks" as IconName,
      title: "Build",
      description:
        "Jakir leads engineering. We build in sprints with weekly check-ins so you always know where things stand. You get access to a staging environment throughout — not just a demo at the end.",
      tags: ["Sprints", "Weekly Check-ins", "Staging Access"],
    },

    {
      icon: "Rocket" as IconName,
      title: "Launch & Beyond",
      description:
        "We handle deployment and monitor the first 72 hours live. We don't disappear at go-live. Most clients continue working with us after launch because the product still needs to grow — we offer ongoing support and iteration on a retainer or project basis.",
      tags: ["Deployment", "Monitoring", "Ongoing Support"],
    },
  ] satisfies ProcessStep[],
} as const

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

export const faqData = {
  badge: "FAQ",
  title: "Common questions.",

  items: [
    {
      question: "How much does a project cost?",
      answer:
        "Projects start from £5,000 for a focused MVP or feature build. Full product builds — including design, engineering, and deployment — typically range from £12,000 to £40,000 depending on scope and complexity. We give you a clear fixed price before anything starts. No open-ended billing.",
    },
    {
      question: "Why not just use an AI website builder?",
      answer:
        "For a landing page or simple brochure site — honestly, you probably could. But if your product handles payments, user data, medical records, or business-critical workflows, AI-generated code creates real security and compliance risks. We build products where the architecture, data handling, and security are engineered properly from day one. Our clients choose us because they can't afford for it to go wrong.",
    },
    {
      question: "How long does a project take?",
      answer:
        "A focused MVP takes 4–8 weeks. A full product with multiple features takes 10–16 weeks. We'll tell you exactly at the discovery stage — and we don't take on projects we can't deliver on time.",
    },
    {
      question: "Who actually works on my project?",
      answer:
        "Both founders. Jakir leads the engineering. Kyaw handles communication, delivery coordination, and making sure what we build solves your actual business problem. You are never handed to a junior team or a subcontractor you've never met.",
    },
    {
      question: "Do you work with early-stage startups?",
      answer:
        "Yes — most of our clients are founders building their first or second product. We understand pre-seed budgets and investor timelines. If you need to move fast and build something fundable, that's our sweet spot.",
    },
    {
      question: "What happens after launch?",
      answer:
        "We don't disappear at go-live. We offer ongoing support, bug fixes, and feature development on a retainer or project basis. Most clients continue working with us after launch.",
    },
    {
      question: "Do you sign NDAs?",
      answer: "Yes — always, and before any discussion of your product details.",
    },
    {
      question: "Can you work with our existing codebase?",
      answer:
        "Yes. We've taken over legacy systems, modernised them, and scaled them. If you have existing code, we'll audit it honestly before committing to anything.",
    },
    {
      question: "What time zones do you work across?",
      answer:
        "Our founders are based in Dhaka (UTC+6) and work with clients in the UK, US, Canada, and the Middle East. We're comfortable with async collaboration and scheduled calls across time zones.",
    },
  ],
} as const

export const ctaData = {
  title: "Let's Build Something Amazing Together",
  description:
    "Tell us about your project. We'll respond within one business day with a clear, honest take on scope, timeline, and how we'd approach it.",
  button: { label: "Book a Call", href: "/#contact" } satisfies ButtonLink,
} as const

export type HeroBannerData = typeof heroBannerData
export type ProjectVideoData = typeof projectVideoData
export type WhoWeAreData = typeof whoWeAreData
export type FoundersData = typeof foundersData
export type ServicesData = typeof servicesData
export type ProcessData = typeof processData
export type FaqData = typeof faqData
export type TestimonialsData = typeof testimonialsData
export type CtaData = typeof ctaData
