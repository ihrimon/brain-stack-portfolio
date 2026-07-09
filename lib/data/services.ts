export const servicesData = [
  {
    slug: "full-stack-development",
    icon: "Layers",
    title: "Full Stack Development",
    description:
      "End-to-end web engineering — from database schema to pixel-perfect UI — built on modern, maintainable architecture.",
    features: [
      "React, Next.js & Node.js",
      "API design & integration",
      "Scalable database architecture",
      "Performance-first engineering",
    ],
  },
  {
    slug: "mobile-app-development",
    icon: "Smartphone",
    title: "Mobile App Development",
    description:
      "Native-feeling iOS and Android apps from a single React Native codebase, shipped to both stores with confidence.",
    features: [
      "React Native & Flutter",
      "Offline-first architecture",
      "App Store & Play Store launch",
      "Push notifications & analytics",
    ],
  },
  {
    slug: "ai-integration-automation",
    icon: "Sparkles",
    title: "AI Integration & Automation",
    description:
      "LLM-powered features, intelligent agents, and workflow automation that remove manual work from your business.",
    features: [
      "LLM & RAG implementation",
      "Custom AI agents",
      "Chatbots & copilots",
      "Workflow & business automation",
    ],
  },
  {
    slug: "saas-development",
    icon: "Cloud",
    title: "SaaS Development",
    description:
      "Multi-tenant SaaS platforms engineered for subscription billing, scale, and rapid iteration from day one.",
    features: [
      "Multi-tenant architecture",
      "Subscription & billing systems",
      "Role-based access control",
      "Usage analytics & dashboards",
    ],
  },
  {
    slug: "ui-ux-design",
    icon: "PenTool",
    title: "UI/UX Design",
    description:
      "Interfaces designed around real user behavior — wireframes, prototypes, and design systems that hold up at scale.",
    features: [
      "User research & wireframing",
      "Interactive prototyping",
      "Design systems",
      "Accessibility-first design",
    ],
  },
  {
    slug: "product-engineering",
    icon: "Wrench",
    title: "Product Engineering",
    description:
      "Embedded product teams that own architecture decisions and ship features alongside your in-house team.",
    features: [
      "Technical architecture",
      "Sprint-based delivery",
      "Code quality & review culture",
      "Long-term roadmap support",
    ],
  },
  {
    slug: "cloud-devops",
    icon: "Server",
    title: "Cloud & DevOps",
    description:
      "Infrastructure that scales quietly in the background — CI/CD, monitoring, and cloud architecture done right.",
    features: [
      "AWS, GCP & Azure",
      "CI/CD pipelines",
      "Containerization & orchestration",
      "Monitoring & observability",
    ],
  },
  {
    slug: "mvp-development",
    icon: "Rocket",
    title: "MVP Development",
    description:
      "Validated product built fast — the smallest version of your idea that still proves the business case to users and investors.",
    features: [
      "Rapid prototyping",
      "Lean, scope-controlled builds",
      "Investor-ready demos",
      "Clear path to v2",
    ],
  },
  {
    slug: "digital-transformation",
    icon: "RefreshCw",
    title: "Digital Transformation",
    description:
      "Modernizing legacy systems and workflows with contemporary architecture, automation, and cloud-native tooling.",
    features: [
      "Legacy system modernization",
      "Process automation",
      "Data migration",
      "Change management support",
    ],
  },
] as const

export type Service = (typeof servicesData)[number]
