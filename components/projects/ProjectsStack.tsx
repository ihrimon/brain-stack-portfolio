"use client"

import { ProjectCard } from "@/components/projects/ProjectCard"
import "@/lib/animations/gsap-animations"
import { chunk, type ProjectStackItem } from "@/lib/projects"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface ProjectsStackProps {
  items: ProjectStackItem[]
}

// Stack unit is always a pair, on both desktop and tablet — only the
// *visual* column count changes per breakpoint (grid-cols-1 vs 2, below).
const ROW_SIZE = 2

export function ProjectsStack({ items }: ProjectsStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rows = chunk(items, ROW_SIZE)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-project-card]",
        containerRef.current
      )
      if (cards.length === 0) return

      gsap.effects.fadeUpOnScroll(cards, {
        start: "top 88%",
        yOffset: 48,
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="relative">
      {rows.map((row, rowIndex) => (
        <div
          key={row.map((item) => item.id).join("-")}
          className="relative w-full py-10 lg:py-16"
        >
          <div className="relative mx-auto grid max-w-400 grid-cols-2 gap-3 px-5 sm:gap-6 sm:px-8">
            {row.map((item, itemIndex) => {
              const index = rowIndex * ROW_SIZE + itemIndex

              return <ProjectCard key={item.id} item={item} priority={index < 2} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
