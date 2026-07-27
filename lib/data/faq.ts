// Content brief: SECTION 11 — FAQ
export const faqData = {
  badge: "FAQ",
  title: "Common questions.",

  items: [
    {
      question: "How much does a project cost?",
      answer:
        "Projects start from £5,000 for a focused MVP or feature build. Full product builds — including design, engineering, and deployment — typically range from £12,000 to £40,000 depending on scope and complexity. We give you a clear fixed price before anything starts. No open-ended billing.",
    },
    {
      question: "Why not just use an AI website builder?",
      answer:
        "For a landing page or simple brochure site — honestly, you probably could. But if your product handles payments, user data, medical records, or business-critical workflows, AI-generated code creates real security and compliance risks. We build products where the architecture, data handling, and security are engineered properly from day one. Our clients choose us because they can't afford for it to go wrong.",
    },
    {
      question: "How long does a project take?",
      answer:
        "A focused MVP takes 4–8 weeks. A full product with multiple features takes 10–16 weeks. We'll tell you exactly at the discovery stage — and we don't take on projects we can't deliver on time.",
    },
    {
      question: "Who actually works on my project?",
      answer:
        "Both founders. Jakir leads the engineering. Kyaw handles communication, delivery coordination, and making sure what we build solves your actual business problem. You are never handed to a junior team or a subcontractor you've never met.",
    },
    {
      question: "Do you work with early-stage startups?",
      answer:
        "Yes — most of our clients are founders building their first or second product. We understand pre-seed budgets and investor timelines. If you need to move fast and build something fundable, that's our sweet spot.",
    },
    {
      question: "What happens after launch?",
      answer:
        "We don't disappear at go-live. We offer ongoing support, bug fixes, and feature development on a retainer or project basis. Most clients continue working with us after launch.",
    },
    {
      question: "Do you sign NDAs?",
      answer: "Yes — always, and before any discussion of your product details.",
    },
    {
      question: "Can you work with our existing codebase?",
      answer:
        "Yes. We've taken over legacy systems, modernised them, and scaled them. If you have existing code, we'll audit it honestly before committing to anything.",
    },
    {
      question: "What time zones do you work across?",
      answer:
        "Our founders are based in Dhaka (UTC+6) and work with clients in the UK, US, Canada, and the Middle East. We're comfortable with async collaboration and scheduled calls across time zones.",
    },
  ],
} as const

export type FaqData = typeof faqData
