export const footerData = {
  description:
    "Brain Stack is a full-stack software studio building web, mobile, and AI-powered products for ambitious teams.",
  columns: [
    {
      title: "Company",
      links: [
        { label: "About", href: "/#about" },
        { label: "Process", href: "/#process" },
        { label: "Insights", href: "/#insights" },
        { label: "Contact", href: "/#contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Full Stack Development", href: "/#services" },
        { label: "Mobile App Development", href: "/#services" },
        { label: "AI Integration & Automation", href: "/#services" },
        { label: "SaaS Development", href: "/#services" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Works", href: "/#works" },
        { label: "Insights", href: "/#insights" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
  ],
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/company/brainstack" },
    { label: "X", href: "https://x.com/brainstack" },
    { label: "GitHub", href: "https://github.com/brainstack" },
    { label: "Dribbble", href: "https://dribbble.com/brainstack" },
  ],
  newsletter: {
    title: "Stay in the loop",
    description: "Product engineering and AI insights, once a month. No spam.",
    placeholder: "you@company.com",
    cta: "Subscribe",
  },
  copyright: `© ${new Date().getFullYear()} Brain Stack. All rights reserved.`,
} as const
