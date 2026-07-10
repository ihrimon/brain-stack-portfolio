export const blogsData = {
  badge: "Our Blogs",
  title: "Explore Our Thoughts on Technology & Innovation",

  posts: [
    {
      slug: "why-ai-assisted-development-is-the-new-baseline",
      title: "Why AI-Assisted Development Is the New Baseline",
      excerpt:
        "How LLM-powered tooling is changing what a senior engineering team can ship in a single sprint — and what it means for your roadmap.",
      category: "AI & Engineering",
      date: "2026-05-12",
      image: "/images/blog/blog-1.webp",
    },
    {
      slug: "choosing-between-mvp-and-full-product-build",
      title: "MVP or Full Build? How to Choose",
      excerpt:
        "A practical framework for deciding how much product to build before your first real users touch it.",
      category: "Product Strategy",
      date: "2026-04-03",
      image: "/images/blog/blog-2.webp",
    },
    {
      slug: "scaling-a-saas-platform-past-your-first-100-customers",
      title: "Scaling a SaaS Platform Past Your First 100 Customers",
      excerpt:
        "The architecture decisions that matter once your product stops being a prototype and starts being infrastructure.",
      category: "SaaS Engineering",
      date: "2026-02-20",
      image: "/images/blog/blog-3.webp",
    },
  ],
} as const
