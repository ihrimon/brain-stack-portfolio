"use client"

import { ProjectCard } from "@/components/projects/ProjectCard"
import type { ProjectStackItem } from "@/lib/projects"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface ProjectsStackProps {
  items: ProjectStackItem[]
}

// Cards eager-load for the first visible row only.
const PRIORITY_COUNT = 2

/**
 * Two columns from tablets up. Each card's visibility follows its place on
 * screen (scrubbed, so it runs backwards when scrolling up):
 *   - entering from the bottom it rises, un-blurs and fades in while the
 *     image settles from a slight zoom;
 *   - in the upper half it stays fully shown;
 *   - leaving through the top it lifts, shrinks a touch and fades out.
 * So roughly one row (two projects) is in focus at a time: as the next row
 * comes up, the row above it dissolves.
 */
export function ProjectsStack({ items }: ProjectsStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-project-card]",
        containerRef.current
      )
      if (cards.length === 0) return

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card, i) => {
          const media = card.querySelector<HTMLElement>("[data-media-host] > *")
          // Right-hand column trails the left one slightly (two columns from sm).
          const lag = i % 2 === 1 && window.innerWidth >= 640 ? 0.05 : 0

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          })

          // Timeline 0 → 1 maps to the card's trip from the bottom edge of
          // the screen to the top edge.
          tl.fromTo(
            card,
            { autoAlpha: 0, y: 90, scale: 0.94, filter: "blur(8px)" },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.3,
              ease: "power2.out",
            },
            lag
          )
          if (media) {
            tl.fromTo(media, { scale: 1.15 }, { scale: 1, duration: 0.45 }, lag)
          }
          tl.to(
            card,
            {
              autoAlpha: 0,
              y: -70,
              scale: 0.95,
              filter: "blur(6px)",
              duration: 0.3,
              ease: "power2.in",
            },
            0.7
          )
        })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="relative">
      <div className="mx-auto grid max-w-site grid-cols-1 gap-x-6 gap-y-14 px-4 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-20 lg:px-6">
        {items.map((item, index) => (
          <ProjectCard key={item.id} item={item} priority={index < PRIORITY_COUNT} />
        ))}
      </div>
    </div>
  )
}
