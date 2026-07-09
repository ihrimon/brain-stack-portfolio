export const projectsData = [
  {
    slug: "ledgerly-fintech-platform",
    title: "Ledgerly",
    category: "SaaS · Fintech",
    description:
      "A multi-tenant expense management platform rebuilt from the ground up — real-time reporting, role-based permissions, and a design system that scaled across 40+ enterprise clients.",
    technologies: ["Next.js", "PostgreSQL", "Node.js", "AWS"],
    image: "/placeholder.svg",
  },
  {
    slug: "nexora-marketplace-app",
    title: "Nexora",
    category: "Mobile · Marketplace",
    description:
      "A cross-platform marketplace app connecting local vendors with customers, built with offline-first sync and launched to both app stores in ten weeks.",
    technologies: ["React Native", "Firebase", "Stripe"],
    image: "/placeholder.svg",
  },
  {
    slug: "flowbyte-workflow-automation",
    title: "Flowbyte",
    category: "AI · Automation",
    description:
      "An AI-powered workflow builder that lets ops teams automate approvals and data entry using natural language — cutting manual processing time by 70%.",
    technologies: ["Python", "OpenAI", "React", "Redis"],
    image: "/placeholder.svg",
  },
  {
    slug: "cloudpeak-devops-dashboard",
    title: "Cloudpeak",
    category: "Cloud · DevOps",
    description:
      "A unified observability dashboard aggregating infrastructure metrics across AWS and GCP, with automated incident response playbooks.",
    technologies: ["Next.js", "Docker", "Kubernetes", "Grafana"],
    image: "/placeholder.svg",
  },
  {
    slug: "vertex-labs-mvp",
    title: "Vertex Labs",
    category: "MVP · Product Engineering",
    description:
      "From pitch deck to funded product: a validated MVP for a climate-data startup, built lean and shipped in six weeks ahead of their seed round.",
    technologies: ["React", "Supabase", "Tailwind CSS"],
    image: "/placeholder.svg",
  },
  {
    slug: "arclight-digital-transformation",
    title: "Arclight",
    category: "Digital Transformation",
    description:
      "Modernizing a 15-year-old logistics platform into a cloud-native system without disrupting daily operations for 2,000+ active users.",
    technologies: ["Node.js", "PostgreSQL", "AWS", "Terraform"],
    image: "/placeholder.svg",
  },
] as const

export type Project = (typeof projectsData)[number]
