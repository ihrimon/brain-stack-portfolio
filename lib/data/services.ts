import type { ServiceOffering } from "./shared-types"

// Content brief: SECTION 5 — Services (homepage "What We Do" section).
// Distinct from lib/data/service-page.ts, which backs the dedicated
// /services page.
//
// Only the fields ServiceAccordion.tsx renders are set here (number, title,
// `items`, button). Each service's icon is mapped by `slug` in that component.
export const servicesData = {
  badge: "What We Do",

  title: "Everything you need to build and\nlaunch a digital product.",

  description:
    "Mobile apps, web platforms, AI tools, and everything in between — designed and built end to end by a senior team that has shipped live products across fintech, healthcare, e-commerce, and SaaS. We're the right fit if your product handles sensitive data, financial transactions, or operates in a regulated industry.",

  items: [
    {
      id: "01",
      slug: "app-design-development",
      title: "App Design & Development",
      items: [
        "User Research",
        "UI/UX Design",
        "iOS & Android Apps",
        "Cross-Platform Solutions",
        "Interactive Prototypes",
        "App Store Launch",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 1,
    },
    {
      id: "02",
      slug: "web-design-development",
      title: "Web Design & Development",
      items: [
        "Custom Web Design",
        "Frontend & Backend Engineering",
        "E-Commerce Solutions",
        "API Integration",
        "Performance & Security",
        "Cloud Hosting",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 2,
    },
    {
      id: "03",
      slug: "ai-autonomous-agents",
      title: "AI & Autonomous Agent Development",
      items: [
        "Custom AI Solutions",
        "LLM Integration",
        "Autonomous AI Agents",
        "Workflow Automation",
        "Smart Chatbots",
        "Predictive Analytics",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 3,
    },
    {
      id: "04",
      slug: "rapid-mvp-development",
      title: "Rapid MVP Development",
      items: [
        "Idea Validation",
        "Product Architecture",
        "Fast Prototyping",
        "Core Feature Build",
        "Scalable Codebase",
        "Launch in Weeks",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 4,
    },
    {
      id: "05",
      slug: "enterprise-pos-erp-saas",
      title: "Enterprise POS, ERP & SaaS Solutions",
      items: [
        "Custom ERP Systems",
        "Retail & POS Software",
        "Multi-Tenant SaaS Systems",
        "Secure Cloud Infrastructure",
        "Workflow Optimization",
        "Enterprise Security",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 5,
    },
    {
      id: "06",
      slug: "business-operations-management",
      title: "Dedicated Business Operations & Management",
      items: [
        "24/7 Project Monitoring",
        "Real-Time Progress Updates",
        "Dedicated Account Manager",
        "Direct Founder Access",
        "Post-Launch Maintenance & Support",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 6,
    },
  ] satisfies ServiceOffering[],
} as const

export type ServicesData = typeof servicesData
