import type {
  ButtonLink,
  IconName,
  ProcessStep,
  ServiceOffering,
  Stat,
  Testimonial,
} from "./shared-types"

export const heroBannerData = {
  badge: "Creative Design Agency",

  title: "Empowering Businesses Through Technology & Innovation",

  description:
    "We design and build scalable digital products — mobile, web, and AI — that help businesses grow faster, innovate effectively, and stay competitive across the US, UK and Europe.",

  button: {
    label: "Start Your Project",
    href: "/contact",
  } satisfies ButtonLink,

  review: {
    label: "Review on Clutch",
    rating: 5,
  },
} as const

export const projectVideoData = {
  badge: "Watch Our Work",

  title: "A Closer Look At How We Build Products",

  description:
    "From first sprint to final launch, we work as an extension of your team — shipping fast without cutting corners. Here's a quick look at how we turn ideas into shipped software.",

  primaryButton: { label: "View Our Work", href: "/projects" } satisfies ButtonLink,
  secondaryButton: { label: "See Our Process", href: "/about" } satisfies ButtonLink,
} as const

export const whoWeAreData = {
  badge: "Who We Are",

  title:
    "We combine creativity, technology, and strategy to transform ambitious ideas into powerful digital solutions.",

  description:
    "We're a team of senior engineers and product designers working globally with ambitious founders. We believe progress only happens when you refuse to play it safe — we combine sharp product thinking, modern tooling and AI-assisted engineering to ship software that lasts.",

  cardTitle: "Build Digital Products, Delivered End-to-End",
  button: { label: "Discover More", href: "/#services" } satisfies ButtonLink,

  stats: [
    {
      value: "60",
      suffix: "+",
      label: "Products shipped",
      description: "Products shipped using modern, AI-assisted engineering",
    },
    {
      value: "12",
      suffix: "y",
      label: "Years",
      description: "Combined craft across mobile, web, cloud and AI",
    },
    {
      value: "40",
      suffix: "+",
      label: "Experts",
      description: "Top-tier engineers, designers and product experts",
    },
  ] satisfies Stat[],
} as const

export const servicesData = {
  badge: "Our Services",
  items: [
    {
      id: "01",
      title: "Branding",
      image: "/images/services/services-1.png",
    },
    {
      id: "02",
      title: "Mobile Design",
      image: "/images/services/services-2.png",
    },
    {
      id: "03",
      title: "Digital Marketing",
      image: "/images/services/services-3.png",
    },
    {
      id: "04",
      title: "Brand Guideline",
      image: "/images/services/services-4.png",
    },
    {
      id: "05",
      title: "Web Development",
      image: "/images/services/services-5.png",
    },
  ] satisfies ServiceOffering[],
} as const

export const processData = {
  badge: "How We Engineer",

  title: "Engineering modern digital solutions.",

  description:
    "Our engineering process combines strategy, design, and cutting-edge technologies to deliver scalable digital products that solve real business problems.",

  items: [
    {
      icon: "Blocks" as IconName,
      title: "End-to-End Development",
      description:
        "From planning and architecture to deployment and maintenance, we build reliable web and mobile solutions with performance, scalability, and long-term growth in mind.",
      tags: ["Mobile", "Web", "Desktop"],
    },

    {
      icon: "BrainCircuit" as IconName,
      title: "Integrating New Technologies",
      description:
        "We leverage AI, automation, cloud computing, IoT, and emerging technologies to create smarter products that improve efficiency and user experience.",
      tags: ["AI Features", "Automation", "Cloud"],
    },

    {
      icon: "PencilLine" as IconName,
      title: "Analysis & Design",
      description:
        "Every successful product starts with research. We analyze business goals, user needs, and market trends before crafting intuitive UI/UX experiences.",
      tags: ["Research", "UI/UX", "Discovery"],
    },
  ] satisfies ProcessStep[],
} as const

export const testimonialsData = {
  badge: "Testimonial",
  title: "What Our Clients Say About Working With Us",
  description: "Transforming ideas into memorable digital experiences.",
  items: [
    {
      rating: 5,
      title: "Outstanding Service",
      quote:
        "Brain Stack transformed our legacy platform into something we're actually proud to demo. Their engineering judgment saved us months.",
      highlight: "saved us months",
      name: "Sarah Johnson",
      role: "CTO",
      company: "Nexora",
      image: "/images/testimonials/customer-1.webp",
    },
    {
      rating: 5,
      title: "Delivered On Time, Under Budget",
      quote:
        "They delivered a complex, multi-tenant SaaS product on time and under budget — and stayed on to help us scale it past 40 clients.",
      highlight: "on time and under budget",
      name: "Michael Chen",
      role: "Founder",
      company: "Ledgerly",
      image: "/images/testimonials/customer-2.webp",
    },
    {
      rating: 5,
      title: "Radical Transparency",
      quote:
        "What stood out was the transparency. Weekly demos, honest timelines, and an engineering team that pushed back when it mattered.",
      highlight: "the transparency",
      name: "Emma Williams",
      role: "Product Director",
      company: "Cloudpeak",
      image: "/images/testimonials/customer-3.webp",
    },
    {
      rating: 5,
      title: "Built To Last",
      quote:
        "Brain Stack shipped our MVP in six weeks — clean enough architecture that we never had to rebuild it after raising our seed round.",
      highlight: "MVP in six weeks",
      name: "David Okafor",
      role: "Founder",
      company: "Vertex Labs",
      image: "/images/testimonials/customer-4.webp",
    },
    {
      rating: 5,
      title: "Doubled Our Engagement",
      quote:
        "Working with Brain Stack was a turning point for our brand. They understood our vision and delivered a modern, user-friendly website that doubled our engagement within a month.",
      highlight: "doubled our engagement",
      name: "Priya Sharma",
      role: "Marketing Lead",
      company: "Northwind",
      image: "/images/testimonials/customer-5.webp",
    },
  ] satisfies Testimonial[],
} as const

export const ctaData = {
  title: "Let's Build Something Amazing Together",
  description:
    "Tell us about your project. We'll respond within one business day with a clear, honest take on scope, timeline, and how we'd approach it.",
  button: { label: "Book a Call", href: "/#contact" } satisfies ButtonLink,
} as const

export type HeroBannerData = typeof heroBannerData
export type ProjectVideoData = typeof projectVideoData
export type WhoWeAreData = typeof whoWeAreData
export type ServicesData = typeof servicesData
export type ProcessData = typeof processData
export type TestimonialsData = typeof testimonialsData
export type CtaData = typeof ctaData
