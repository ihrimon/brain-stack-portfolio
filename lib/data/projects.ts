import type { Testimonial } from "./shared-types"

export interface ProjectChallenge {
  title: string | null
  description: string
  label?: string
  painPoints: string[]
  businessImpact: string[]
}

export interface ProjectSolution {
  title: string
  description: string
  highlights: string[]
}

export interface ProjectWorkflowStep {
  title: string
  description: string
}

export interface ProjectMetrics {
  performance: string
  seo: string
  accessibility: string
  bestPractices: string
}

/**
 * Fields every project has, whether it's a full case study or a lighter
 * portfolio entry. `challenge`/`solution` live here (not on CaseStudyProject)
 * because even "thin" portfolio entries carry a real challenge/solution
 * summary — it's only the *deep-dive* narrative fields below that some
 * projects skip entirely.
 */
export interface BaseProject {
  id: string
  slug: string
  title: string
  shortTitle: string
  /** Content brief Section 6 card label, e.g. "Karially · AI Platform · karially.com". */
  label: string
  category: string
  industry: string
  client: string
  /** Short service line, e.g. "AI Product Design, Web App Development". Portfolio-only projects. */
  service: string | null
  duration: string | null
  /** Year completed, e.g. "2024". Portfolio-only projects. */
  date: string | null
  status: string | null
  liveUrl: string | null

  thumbnail: string
  heroImage: string
  gallery: string[]

  overview: string
  technologies: string[]
  tools: string[]

  challenge: ProjectChallenge
  solution: ProjectSolution
}

/** A portfolio entry without a full engineering-deep-dive write-up. */
export interface PortfolioProject extends BaseProject {
  kind: "portfolio"
}

/** A full case study — every deep-dive narrative field is populated. */
export interface CaseStudyProject extends BaseProject {
  kind: "case-study"
  goals: string[]
  label: string
  workflow: ProjectWorkflowStep[]
  architecture: string[]
  features: string[]
  uiHighlights: string[]
  developmentProcess: string[]
  challengesFaced: string[]
  solutionsImplemented: string[]
  results: string[]
  metrics: ProjectMetrics
  testimonial: Testimonial
  lessonsLearned: string[]
  nextSteps: string[]
  relatedProjects: string[]
}

export type Project = PortfolioProject | CaseStudyProject

// Content brief: SECTION 6 — Projects / Portfolio
export const projectsData = {
  badge: "Featured Work",
  title: "Work we've shipped.",
  description: "Live products, real clients. Click any project to see it.",

  projects: [
    {
      id: "11",
      slug: "karially",
      kind: "portfolio",
      title: "Karially",
      shortTitle: "Karially",
      label: "Karially · AI Platform · karially.com",
      category: "AI Platform",
      industry: "Career Technology",
      client: "Karially",
      service: "AI Product Design, Web App Development",
      technologies: ["React", "TypeScript", "Tailwind CSS", "OpenAI"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://karially.com/",

      thumbnail: "/images/projects/karially/thumbnail.webp",
      heroImage: "/images/projects/karially/thumbnail.webp",
      gallery: [
        "/images/projects/karially/gallery-1.webp",
        "/images/projects/karially/gallery-2.webp",
        "/images/projects/karially/gallery-3.webp",
        "/images/projects/karially/gallery-4.webp",
        "/images/projects/karially/gallery-5.webp",
        "/images/projects/karially/gallery-6.webp",
      ],

      overview:
        "Karially is a career-growth membership that bundles AI tools with real human support — an AI-built roadmap with weekly milestones, an AI resume and cover-letter builder, and live coaching and classes, all under one subscription instead of juggling separate tools.",

      challenge: {
        title: null,
        description:
          "Professionals were overwhelmed by scattered career resources and generic advice that failed to adapt to their unique goals, leaving ambitious talent without a clear path to grow.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Guide every career journey with intelligent, personalized tools and real support",
        description:
          "We built an AI-powered membership platform that learns from each user's goals, generates a personalized career roadmap, and pairs it with an AI resume and cover-letter builder, live monthly classes, and 1:1 coaching — turning generic advice into guidance that actually fits.",
        highlights: [
          "Product Strategy",
          "UX/UI Design",
          "AI Integration",
          "AI Resume & Cover Letter Builder",
          "Front-end Development",
          "Design System",
        ],
      },
    },

    {
      id: "12",
      slug: "luxeb2b",
      kind: "portfolio",
      title: "LuxeB2B",
      shortTitle: "LuxeB2B",
      label: "LuxeB2B · B2B Luxury Marketplace · luxeb2b.com",
      category: "B2B Luxury Marketplace",
      industry: "Luxury Fragrance & Beauty",
      client: "LuxeB2B",
      service: "Marketplace Platform, Brand Identity",
      technologies: ["Next.js", "React", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://luxeb2b.com/",

      thumbnail: "/images/projects/luxeb2b/thumbnail.webp",
      heroImage: "/images/projects/luxeb2b/thumbnail.webp",
      gallery: [
        "/images/projects/luxeb2b/gallery-1.webp",
        "/images/projects/luxeb2b/gallery-2.webp",
        "/images/projects/luxeb2b/gallery-3.webp",
        "/images/projects/luxeb2b/gallery-4.webp",
        "/images/projects/luxeb2b/gallery-5.webp",
        "/images/projects/luxeb2b/gallery-6.webp",
      ],

      overview:
        "A premium B2B directory and lead-discovery network connecting global buyers and suppliers in the luxury fragrance and beauty industry — company profiles, product listings, and category browsing across perfumes, oud, niche fragrances, and cosmetics.",

      challenge: {
        title: null,
        description:
          "Global buyers and suppliers in the luxury fragrance industry lacked a trusted digital marketplace, relying instead on fragmented trade shows and manual negotiations that slowed every deal.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Connect a global luxury trade on one premium directory",
        description:
          "We designed and built a B2B network that lets suppliers create free company profiles and list products by category, and lets buyers discover and browse verified partners across the luxury fragrance and beauty trade — packaged in an experience that matches the prestige of the products themselves.",
        highlights: [
          "Marketplace UX",
          "Front-end Development",
          "Vendor Onboarding Flows",
          "Brand Identity",
        ],
      },
    },

    {
      id: "13",
      slug: "ach-gold-estates",
      kind: "portfolio",
      title: "ACH Gold Estates",
      shortTitle: "ACH Gold Estates",
      label: "ACH Gold Estates · Real Estate Platform · achgoldestates.com",
      category: "Real Estate Platform",
      industry: "Real Estate",
      client: "ACH Gold Estates",
      service: "Real Estate Platform, CMS Integration",
      technologies: ["Next.js", "CMS", "Google Maps"],
      tools: [],
      duration: null,
      date: "2023",
      status: null,
      liveUrl: "https://achgoldestates.com/",

      thumbnail: "/images/projects/ach-gold-estates/thumbnail.webp",
      heroImage: "/images/projects/ach-gold-estates/thumbnail.webp",
      gallery: [
        "/images/projects/ach-gold-estates/gallery-1.webp",
        "/images/projects/ach-gold-estates/gallery-2.webp",
        "/images/projects/ach-gold-estates/gallery-3.webp",
        "/images/projects/ach-gold-estates/gallery-4.webp",
        "/images/projects/ach-gold-estates/gallery-5.webp",
        "/images/projects/ach-gold-estates/gallery-6.webp",
      ],

      overview:
        "A modern student accommodation platform for Nottingham and Derby, UK, with searchable verified listings for prospective tenants and a dedicated partner pathway for letting agents to list their own properties.",

      challenge: {
        title: null,
        description:
          "Prospective tenants and buyers struggled to find accurate, up-to-date property listings, forcing the agency's team to manually field repetitive inquiries instead of closing deals.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Turn property browsing into a seamless self-serve experience",
        description:
          "We delivered a modern listings platform with an integrated CMS and map-based search, letting the team publish new inventory in minutes and letting prospects filter, compare and enquire without ever picking up the phone.",
        highlights: [
          "Web Development",
          "CMS Integration",
          "Google Maps Integration",
          "UX/UI Design",
        ],
      },
    },

    {
      id: "14",
      slug: "c-smith",
      kind: "portfolio",
      title: "C Smith",
      shortTitle: "C Smith",
      label: "C Smith · Personal Portfolio · csmith-rho.vercel.app",
      category: "Personal Portfolio",
      industry: "Personal Branding",
      client: "C Smith",
      service: "Personal Portfolio, Web Development",
      technologies: ["Next.js", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://csmith-rho.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-1.webp",
      heroImage: "/images/project-thumbnails/thumbnail-1.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A clean, focused personal portfolio site built to showcase C Smith's work and background in a single, fast-loading page.",

      challenge: {
        title: null,
        description:
          "A scattered presence across resumes, social profiles, and one-off links made it hard for prospective clients and collaborators to get a clear picture of the work in one place.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "One fast, focused page that tells the whole story",
        description:
          "We designed and built a lightweight personal portfolio — clear sections, fast load times, and a layout built to grow as new work gets added.",
        highlights: ["Personal Branding", "UX/UI Design", "Front-end Development"],
      },
    },

    {
      id: "17",
      slug: "powernest",
      kind: "portfolio",
      title: "PowerNest",
      shortTitle: "PowerNest",
      label: "PowerNest · Business Website · powernest-nu.vercel.app",
      category: "Business Website",
      industry: "Consumer Electronics Retail",
      client: "PowerNest",
      service: "E-commerce Development, Payment Integration",
      technologies: ["Next.js", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://powernest-nu.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-7.webp",
      heroImage: "/images/project-thumbnails/thumbnail-7.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "PowerNest is a full online electronics storefront built for Bangladeshi shoppers — power banks, headphones, phones, laptops, and accessories, with local bKash/Nagad payments, cash on delivery, and 0% EMI on every order.",

      challenge: {
        title: null,
        description:
          "Bangladeshi shoppers had few online electronics retailers they could trust for genuine products, and even fewer that supported the local payment methods most households actually use.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Build an online electronics store Bangladeshi shoppers actually trust",
        description:
          "We built a full e-commerce platform around 100% genuine products with official warranty, integrated bKash, Nagad, and cash-on-delivery alongside 0% EMI up to 24 months, and backed it with nationwide free delivery and a 7-day return policy.",
        highlights: [
          "E-commerce Development",
          "Local Payment Integration (bKash, Nagad, COD)",
          "UX/UI Design",
        ],
      },
    },

    {
      id: "16",
      slug: "james-orpin",
      kind: "portfolio",
      title: "James Orpin",
      shortTitle: "James Orpin",
      label: "James Orpin · Portfolio Website · james-orpin-beta.vercel.app",
      category: "Portfolio Website",
      industry: "Personal Branding",
      client: "James Orpin",
      service: "Portfolio Website, Web Development",
      technologies: ["Next.js", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://james-orpin-beta.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-2.webp",
      heroImage: "/images/project-thumbnails/thumbnail-2.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A polished personal portfolio website built to present James Orpin's work and experience clearly to prospective clients and employers.",

      challenge: {
        title: null,
        description:
          "Without a dedicated site, work samples and background were spread across disconnected links, making it hard for anyone to get the full picture quickly.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "A single, polished home for the work",
        description:
          "We designed and built a portfolio site with a clear structure — work, background, and contact — so visitors can find what they need in seconds.",
        highlights: ["Personal Branding", "UX/UI Design", "Front-end Development"],
      },
    },

    {
      id: "19",
      slug: "yachtease",
      kind: "portfolio",
      title: "YachtEase",
      shortTitle: "YachtEase",
      label: "YachtEase · Luxury Travel · yachtease.co",
      category: "Luxury Travel",
      industry: "Yachting & Marine Operations",
      client: "YachtEase",
      service: "Marketplace Platform, Operations Dashboard",
      technologies: ["Next.js", "Tailwind CSS", "Stripe"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://yachtease.co/",

      thumbnail: "/images/project-thumbnails/thumbnail-9.webp",
      heroImage: "/images/project-thumbnails/thumbnail-9.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "YachtEase is an operations marketplace built for the yachting industry — one dashboard connecting yacht management, suppliers, crew, and freelancers so senior crew can source, hire, and communicate without juggling emails and spreadsheets.",

      challenge: {
        title: null,
        description:
          "Running a yacht's day-to-day operations meant sourcing suppliers, hiring crew, and coordinating logistics across scattered email threads and chat apps, with no single place to track quotes, orders, or who was available in the next port.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Give yacht operations a single, considered workspace",
        description:
          "We built a role-based marketplace with dedicated entry points for yacht management, suppliers, crew, and freelancers — bundling quotes, orders, invoices, and messaging into one thread per supplier, with port-based search and verified profiles.",
        highlights: [
          "Marketplace Platform Development",
          "Role-Based Dashboards",
          "Booking & Messaging System",
          "UX/UI Design",
        ],
      },
    },

    {
      id: "18",
      slug: "briataor-paint",
      kind: "portfolio",
      title: "Briataor Paint",
      shortTitle: "Briataor Paint",
      label: "Briataor Paint · Brand Website · briataor-paint.vercel.app",
      category: "Brand Website",
      industry: "Paint & Coatings",
      client: "Briataor Paint",
      service: "Brand Website, Web Development",
      technologies: ["Next.js", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://briataor-paint.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-3.webp",
      heroImage: "/images/project-thumbnails/thumbnail-3.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A brand website for Briataor Paint, presenting the company's product range and identity to prospective buyers and partners.",

      challenge: {
        title: null,
        description:
          "The brand had no dedicated web presence to showcase its product range and identity, relying instead on offline catalogs and word of mouth.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Give the brand a digital home that matches its identity",
        description:
          "We designed and built a brand website that presents the product range and company identity clearly, giving the business a proper digital front door.",
        highlights: ["Brand Identity", "UX/UI Design", "Front-end Development"],
      },
    },

    {
      id: "15",
      slug: "big-fish",
      kind: "portfolio",
      title: "Big Fish",
      shortTitle: "Big Fish",
      label: "Big Fish · Creative Portfolio · bigfish-omega.vercel.app",
      category: "Creative Portfolio",
      industry: "Creative Studio",
      client: "Big Fish",
      service: "Creative Portfolio, Interactive Design",
      technologies: ["Next.js", "GSAP", "Framer Motion"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://bigfish-omega.vercel.app/",

      thumbnail: "/images/projects/big-fish/thumbnail.webp",
      heroImage: "/images/projects/big-fish/thumbnail.webp",
      gallery: [
        "/images/projects/big-fish/gallery-1.webp",
        "/images/projects/big-fish/gallery-2.webp",
        "/images/projects/big-fish/gallery-3.webp",
        "/images/projects/big-fish/gallery-4.webp",
        "/images/projects/big-fish/gallery-5.webp",
        "/images/projects/big-fish/gallery-6.webp",
      ],

      overview:
        "An interactive portfolio experience with immersive layouts, storytelling, and engaging motion design.",

      challenge: {
        title: null,
        description:
          "A standard grid portfolio couldn't capture the studio's storytelling-driven creative process, making their work feel flatter online than it does in the room.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Turn scrolling into a story worth staying for",
        description:
          "We built an immersive, motion-first portfolio where layout and animation carry the narrative — every project unfolds like a scene rather than a static case study.",
        highlights: [
          "Interaction Design",
          "GSAP Animation",
          "Framer Motion",
          "Front-end Development",
        ],
      },
    },

    {
      id: "20",
      slug: "davorron-martis",
      kind: "portfolio",
      title: "Davorron Martis",
      shortTitle: "Davorron Martis",
      label: "Davorron Martis · Creative Portfolio · davorron-martisnew.vercel.app",
      category: "Creative Portfolio",
      industry: "Creative Studio",
      client: "Davorron Martis",
      service: "Creative Portfolio, Web Development",
      technologies: ["Next.js", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://davorron-martisnew.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-4.webp",
      heroImage: "/images/project-thumbnails/thumbnail-4.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A creative portfolio site built to showcase Davorron Martis's work with a clean, gallery-first presentation.",

      challenge: {
        title: null,
        description:
          "Creative work spread across social platforms made it hard for prospective clients to see a cohesive, professional body of work in one place.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "A gallery-first showcase for the work",
        description:
          "We designed and built a creative portfolio that puts the work front and center, with a clean gallery layout and simple navigation.",
        highlights: ["Creative Portfolio", "UX/UI Design", "Front-end Development"],
      },
    },
  ] satisfies Project[],
} as const
