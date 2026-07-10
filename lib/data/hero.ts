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

  title: "Empowering Businesses Through Technology & Innovation",

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
}
