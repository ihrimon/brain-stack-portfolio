import { heroData } from "@/lib/data/hero"

export const aboutData = {
  eyebrow: "Who We Are",

  title:
    "We are a team of driven engineers and designers dedicated to bringing your ideas to life.",

  description:
    "We're a team of senior engineers and product designers working globally with ambitious founders. We believe progress only happens when you refuse to play it safe — we combine sharp product thinking, modern tooling and AI-assisted engineering to ship software that lasts.",

  card: {
    title: "End-to-End Software Delivery",
    cta: { text: "Discover More", href: "/#services" },
    image: "/images/globe.png",
  },

  statsCard: {
    trustLine:
      "Trusted by 40+ clients across 3 continents — shipping products from idea to production in weeks, not quarters.",
    review: heroData.review,
  },

  stats: heroData.stats,
} as const
