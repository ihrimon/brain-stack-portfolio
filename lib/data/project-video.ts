import type { ButtonLink } from "./shared-types"

// Content brief: SECTION 6 — Projects / Portfolio (homepage "Watch Our Work"
// video banner, shown alongside the ProjectsSection carousel).
export const projectVideoData = {
  badge: "Watch Our Work",

  title: "A Closer Look At How We Build Products",

  description:
    "From first sprint to final launch, we work as an extension of your team — shipping fast without cutting corners. Here's a quick look at how we turn ideas into shipped software.",

  primaryButton: { label: "View Our Work", href: "/projects" } satisfies ButtonLink,
  secondaryButton: { label: "See Our Process", href: "/about" } satisfies ButtonLink,
} as const

export type ProjectVideoData = typeof projectVideoData
