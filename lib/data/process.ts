import type { IconName, ProcessStep } from "./shared-types"

// Content brief: SECTION 7 — How We Work / Process
export const processData = {
  badge: "How We Engineer",

  title: "How we work.",

  description:
    "No surprises. No hand-offs to juniors. The same two people who scoped your project build it and deliver it.",

  items: [
    {
      icon: "Search" as IconName,
      title: "Discovery",
      description:
        "We start with your business, not your brief. We ask what you're actually trying to solve, who uses it, and what success looks like in 90 days. We ask the straightforward questions before a line of code is written. Output: clear scope, tech recommendation, fixed timeline, and fixed price.",
      tags: ["Scoping", "Fixed Price", "Fixed Timeline"],
    },

    {
      icon: "PencilLine" as IconName,
      title: "Design",
      description:
        "Before we build, we map. Wireframes, user flows, and architecture decisions get agreed here. You review and approve everything before development starts. No surprises halfway through.",
      tags: ["Wireframes", "User Flows", "Architecture"],
    },

    {
      icon: "Blocks" as IconName,
      title: "Build",
      description:
        "Jakir leads engineering. We build in sprints with weekly check-ins so you always know where things stand. You get access to a staging environment throughout — not just a demo at the end.",
      tags: ["Sprints", "Weekly Check-ins", "Staging Access"],
    },

    {
      icon: "Rocket" as IconName,
      title: "Launch & Beyond",
      description:
        "We handle deployment and monitor the first 72 hours live. We don't disappear at go-live. Most clients continue working with us after launch because the product still needs to grow — we offer ongoing support and iteration on a retainer or project basis.",
      tags: ["Deployment", "Monitoring", "Ongoing Support"],
    },
  ] satisfies ProcessStep[],
} as const

export type ProcessData = typeof processData
