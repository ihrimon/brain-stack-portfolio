// Content brief: SECTION 4 — The Team Behind Brain Stack
export const foundersData = {
  badge: "The Team",

  title: "Built by founders\nrun by founders",

  description:
    "Two senior builders and a trusted network of specialist contractors. Every project runs through us directly — no account managers, no hand-offs.",

  members: [
    {
      name: "Jakir Uddin",
      title: "Founder & CTO",
      initials: "JU",
      image: "/images/team/jakir-uddin.webp",
      bio: "Senior Full-Stack Engineer with 4+ years building production-grade mobile and web products across fintech, healthcare, and AI. He has led engineering across four simultaneous SaaS and mobile products, modernised HIPAA-compliant healthcare platforms, and shipped AI-powered consumer apps live on the App Store and Google Play.",
      shortBio:
        "He architects the systems, writes the code, and ensures every product Brain Stack ships is clean, scalable, and maintainable long after launch.",

      // bio: "Senior Full-Stack Engineer with 4+ years building production-grade mobile and web products across fintech, healthcare, and AI. He architects the systems, writes the code, and ensures every product ships clean, scalable, and maintainable.",
      linkedin: "https://linkedin.com/in/jakir-uddin-jahid",
      skills: [
        "Rapid MVP Development",
        "App & Web Engineering",
        "Enterprise AI Systems",
        "Autonomous Agent Development",
      ],
    },
    {
      name: "Kyaw Munn Oo",
      title: "Co-Founder",
      initials: "KMO",
      image: "/images/team/kyaw-munn-oo.webp",
      // bio: "Leads the business, client relationships, and growth side of Brain Stack. His background spans product strategy, sales, marketing, and content. He's the person who understands your business problem before it becomes a product brief.",
      bio: "Leads the business, client relationships, and growth side of Brain Stack. His background spans product strategy, sales, marketing, and content - he has marketed a Y-Combinator-backed AI app (YCW24), led content strategy for digital brands, and was a top-performing campus sales rep at Hexa",
      shortBio:
        "He's the person who understands your business problem before it becomes a product brief, and who makes sure what Brain Stack builds actually solves it.",
      linkedin: "https://linkedin.com/in/kyawmunn",
      skills: [
        "Requirement Analysis & Product Scope",
        "Operations",
        "Growth Marketing & Strategy",
        "Business Development",
      ],
    },
  ],

  footnote:
    "We work with a trusted network of senior contractors, developers, designers, and AI specialists — brought in for specific project needs.",
} as const

export type FoundersData = typeof foundersData
