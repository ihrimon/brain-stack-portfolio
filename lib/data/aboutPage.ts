export const aboutPageData = {
  mission: {
    image: "/images/services/services-1.png",
    heading: [
      { text: "Turning Vision", muted: false },
      { text: "into ", muted: false },
      { text: "reality", muted: true },
    ],
    mission: {
      title: "Our Mission",
      description:
        "To turn ambitious ideas into software that ships — combining sharp product thinking, modern tooling, and AI-assisted engineering to build digital experiences that inspire action and create lasting impact.",
      highlights: ["digital experiences", "businesses", "high-performance digital solutions"],
    },
    approach: {
      title: "Our Approach",
      items: [
        "Clear and focused strategy",
        "Design that drives impact",
        "Collaboration without the chaos",
        "Outcomes that build momentum",
        "Smart solutions, tailored for you",
      ],
    },
  },

  stats: [
    { value: 60, suffix: "+", label: "Products Shipped" },
    { value: 40, suffix: "+", label: "Global Clients" },
    { value: 12, suffix: "+", label: "Years Combined Experience" },
    { value: 97, suffix: "%", label: "Client Satisfaction" },
  ],

  features: {
    plan: {
      title: "Flexible Engagements",
      description: "Get premium engineering without premium overhead.",
      note: "Pause & resume anytime",
    },
    rating: {
      stars: 5,
      title: "Happy Clients Worldwide",
      count: "40+",
      score: "4.9+",
      avatars: [
        "/images/testimonials/customer-1.webp",
        "/images/testimonials/customer-2.webp",
        "/images/testimonials/customer-3.webp",
        "/images/testimonials/customer-4.webp",
      ],
    },
    strategy: {
      title: "Strategic solutions for lasting impact",
      items: [
        "Tailored strategy",
        "High-quality output",
        "Timely delivery",
        "Transparent process",
        "Post-launch support",
      ],
      cta: { label: "View All Projects", href: "/portfolio" },
    },
    support: {
      title: "24/7",
      subtitle: "Always on Support",
      message: "How can I help you?",
    },
    reliable: {
      title: "Reliable & Future-ready",
    },
    stack: {
      title: "Built With The Best",
      description: "Access the latest tools, fully integrated and ready to go.",
      tools: ["React", "Next.js", "Node.js", "OpenAI", "AWS", "Docker"],
    },
  },

  approach: {
    label: "Approach",
    title: "Method of making better results",
    steps: [
      {
        title: "Problem Discovery",
        items: [
          "Usability Studies",
          "User Interviews",
          "Stakeholder Interviews",
          "Competitive Research",
          "Insights Report",
          "User Journey",
        ],
      },
      {
        title: "Design System Ready",
        items: [
          "Thinking Workshops",
          "Sitemaps",
          "Concepts",
          "Designs",
          "Prototypes",
          "Usability Studies",
        ],
      },
      {
        title: "Design Implementation",
        items: [
          "Design",
          "Use Cases",
          "User Flows",
          "Various User Types",
          "Annotations",
          "Interactions",
        ],
      },
    ],
  },

  inquiry: {
    heading: "Have a project idea in mind? Let's get started",
  },
} as const
