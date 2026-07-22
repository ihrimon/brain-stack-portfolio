"use client"

import {
  heroMetrics,
  heroReviews,
  heroTagline,
  heroWorkflow,
} from "@/lib/data/hero-panel"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { AnimatedDivider } from "./AnimatedDivider"
import { HeroMetrics } from "./HeroMetrics"
import { HeroReviews } from "./HeroReviews"
import { HeroTagline } from "./HeroTagline"
import { HeroWorkflow } from "./HeroWorkflow"
import { PanelBackground } from "./PanelBackground"

interface HeroIntelligencePanelProps {
  className?: string
}

/**
 * The Hero's left-column "Brain Stack Intelligence Panel" — reviews,
 * live workflow, metrics, and tagline, stacked and separated by
 * `AnimatedDivider`s so it reads as one continuous instrument rather than
 * four boxed cards.
 *
 * This component owns only the *entrance sequence* (reviews fade in,
 * workflow steps stagger in, metrics section fades up, tagline slides up)
 * — each child then keeps running its own independent, isolated loop
 * (star shimmer, step cycling, metric pulse, divider glow, tagline
 * chevrons, background particles) for as long as it's mounted. Nothing
 * here reaches into a child's internals beyond querying its own
 * `data-panel-*`/`data-workflow-step` markers for the reveal timeline.
 */
export function HeroIntelligencePanel({ className }: HeroIntelligencePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reviews = panelRef.current?.querySelector("[data-panel-reviews]")
      const workflowSteps = panelRef.current?.querySelectorAll(
        "[data-workflow-step]"
      )
      const metrics = panelRef.current?.querySelector("[data-panel-metrics]")
      const tagline = panelRef.current?.querySelector("[data-panel-tagline]")

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } })

        if (reviews) {
          tl.from(reviews, { autoAlpha: 0, y: 16, duration: 0.7 })
        }
        if (workflowSteps && workflowSteps.length > 0) {
          tl.from(
            workflowSteps,
            { autoAlpha: 0, x: -12, duration: 0.5, stagger: 0.12 },
            "-=0.25"
          )
        }
        if (metrics) {
          tl.from(metrics, { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.1")
        }
        if (tagline) {
          tl.from(tagline, { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.2")
        }

        return () => tl.kill()
      })

      return () => mm.revert()
    },
    { scope: panelRef }
  )

  return (
    <div ref={panelRef} className={cn("relative flex flex-col gap-6", className)}>
      <div data-panel-reviews>
        <HeroReviews data={heroReviews} />
      </div>

      <AnimatedDivider />

      <div data-panel-metrics>
        <HeroMetrics data={heroMetrics} />
      </div>

      <AnimatedDivider />

      <div data-panel-tagline>
        <HeroTagline data={heroTagline} />
      </div>
    </div>
  )
}
