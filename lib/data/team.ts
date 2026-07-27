// Content brief: SECTION 4 — The Team Behind Brain Stack
export const foundersData = {
  badge: "The Team Behind",

  title: "Built by founders, run by founders.",

  description:
    "Two senior builders and a trusted network of specialist contractors. Every project runs through us directly — no account managers, no hand-offs.",

  members: [
    {
      name: "Jakir Uddin",
      title: "Founder & CTO",
      initials: "JU",
      image: "/images/team/jakir-uddin.webp",
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
      image: "/images/team/kyaw-munn-oo.webp",
      bio: "Leads the business, client relationships, and growth side of Brain Stack. His background spans product strategy, sales, marketing, and content. He's the person who understands your business problem before it becomes a product brief.",
      linkedin: "https://linkedin.com/in/kyawmunn",
      skills: ["Product Strategy", "Sales & BD", "Content & Growth Marketing"],
    },
  ],

  footnote:
    "We work with a trusted network of senior contractors — developers, designers, and AI specialists — brought in for specific project needs.",
} as const

export type FoundersData = typeof foundersData
