// lib/data/hero.ts

export const navItems = [
  { name: "Services", href: "/#services" },
  { name: "Projects", href: "/#projects" },
  { name: "Company", href: "/#company" },
  { name: "Blog", href: "/#blog" },
  { name: "Contacts", href: "/#contacts" },
] as const

export const heroData = {
  badge: "Creative Design Agency",

  title: "Cutting edge software, engineered end to end.",

  description:
    "We design and build scalable digital products — mobile, web, and AI — that help businesses grow faster, innovate effectively, and stay competitive across the US, UK and Europe.",

  primaryButton: {
    text: "Start Your Project",
    href: "/contact",
  },

  review: {
    label: "Review on Clutch",
    rating: 5,
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
    {
      value: "3",
      highlight: "",
      title: "Continents",
      description: "Clients served across London, New York and Berlin",
    },
  ],
}
