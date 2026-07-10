export const testimonialsData = {
  badge: "Testimonial",
  title: "What Our Clients Say About Working With Us",
  description: "Transforming ideas into memorable digital experiences.",

  reviewPlatforms: [
    { label: "Clutch", rating: 5, reviews: 20 },
    { label: "Google", rating: 5, reviews: 20 },
  ],

  items: [
    {
      rating: 5,
      title: "Outstanding Service",
      quote:
        "Brain Stack transformed our legacy platform into something we're actually proud to demo. Their engineering judgment saved us months.",
      highlight: "saved us months",
      author: "Sarah Johnson",
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
      author: "Michael Chen",
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
      author: "Emma Williams",
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
      author: "David Okafor",
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
      author: "Priya Sharma",
      role: "Marketing Lead",
      company: "Northwind",
      image: "/images/testimonials/customer-5.webp",
    },
  ],
} as const
