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

  title: "Engineering Digital Products That Scale",

  description:
    "From full-stack development to AI, cloud and product engineering — we bring the disciplines ambitious teams need to design, build and scale a digital product end-to-end.",

  items: [
    {
      id: "01",
      slug: "branding",
      icon: "Palette" as IconName,
      title: "Branding",
      image: "/images/services/services-1.png",
      shortDescription:
        "Identity systems that make ambitious products instantly recognizable.",
      fullDescription:
        "We shape how a product looks, sounds and feels — logo, color, typography and voice — into a system your team can apply consistently from a landing page to a pitch deck, so the brand never outgrows the business.",
      technologies: ["Figma", "Brand Systems", "Motion Design"],
      features: [
        "Visual identity design",
        "Brand guideline docs",
        "Design system foundations",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      featured: true,
      order: 1,
    },
    {
      id: "02",
      slug: "mobile-design",
      icon: "Smartphone" as IconName,
      title: "Mobile Design",
      image: "/images/services/services-2.png",
      shortDescription:
        "Native-feeling app experiences designed for iOS and Android.",
      fullDescription:
        "We design mobile products from wireframe to pixel-perfect UI, balancing platform conventions with your brand, so the app feels considered on every screen size and OS version.",
      technologies: ["Figma", "iOS HIG", "Material Design"],
      features: [
        "UX research & flows",
        "High-fidelity UI kits",
        "Interactive prototypes",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 2,
    },
    {
      id: "03",
      slug: "digital-marketing",
      icon: "Megaphone" as IconName,
      title: "Digital Marketing",
      image: "/images/services/services-3.png",
      shortDescription:
        "Growth strategy and campaigns that turn traffic into customers.",
      fullDescription:
        "We plan and run the campaigns that get a product in front of the right audience — SEO, paid, content and lifecycle marketing — tied back to the metrics that actually move the business.",
      technologies: ["SEO", "Paid Media", "Analytics"],
      features: [
        "Growth strategy",
        "Campaign management",
        "Performance reporting",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 3,
    },
    {
      id: "04",
      slug: "brand-guideline",
      icon: "BookOpen" as IconName,
      title: "Brand Guideline",
      image: "/images/services/services-4.png",
      shortDescription:
        "Documented systems that keep every team on-brand at scale.",
      fullDescription:
        "We turn a brand identity into a living reference — logo usage, color, type, imagery and tone — so designers, marketers and partners can all build on it without drifting off-brand.",
      technologies: ["Notion", "Figma", "Style Guides"],
      features: [
        "Usage documentation",
        "Asset libraries",
        "Team onboarding",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 4,
    },
    {
      id: "05",
      slug: "web-development",
      icon: "Code2" as IconName,
      title: "Web Development",
      image: "/images/services/services-5.png",
      shortDescription:
        "Fast, scalable web products built with modern engineering.",
      fullDescription:
        "We build and ship production web applications — from marketing sites to complex SaaS platforms — with the performance, accessibility and architecture to grow with the business.",
      technologies: ["Next.js", "TypeScript", "Cloud Infrastructure"],
      features: [
        "Full-stack development",
        "API & cloud architecture",
        "Performance optimization",
      ],
      buttonLabel: "Explore Service",
      buttonHref: "/services",
      order: 5,
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
