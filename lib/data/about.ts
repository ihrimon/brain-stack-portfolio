import { heroData } from "@/lib/data/hero"

export const aboutData = {
  eyebrow: "Who We Are",

  title:
    "We combine creativity, technology, and strategy to transform ambitious ideas into powerful digital solutions.",

  description:
    "We're a team of senior engineers and product designers working globally with ambitious founders. We believe progress only happens when you refuse to play it safe — we combine sharp product thinking, modern tooling and AI-assisted engineering to ship software that lasts.",

  card: {
    title: "Build Digital Products, Delivered End-to-End",
    cta: { text: "Discover More", href: "/#services" },
  },

  statsCard: {
    trustLine:
      "Trusted by 40+ clients across 3 continents — shipping products from idea to production in weeks, not quarters.",
    review: heroData.review,
  },

  stats: [
    {
      value: "60",
      highlight: "+",
      title: "Products shipped",
      description: "Products shipped using modern, AI-assisted engineering",
    },
    {
      value: "12",
      highlight: "y",
      title: "Years",
      description: "Combined craft across mobile, web, cloud and AI",
    },
    {
      value: "40",
      highlight: "+",
      title: "Experts",
      description: "Top-tier engineers, designers and product experts",
    },
  ],
} as const
