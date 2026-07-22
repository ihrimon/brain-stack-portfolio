"use client"

import { ProjectCard, type ProjectCardHandle } from "@/components/projects/ProjectCard"
import { chunk, type ProjectStackItem } from "@/lib/projects"
import { useProjectsStackAnimation } from "@/hooks/useProjectsStackAnimation"
import { useRef } from "react"

interface ProjectsStackProps {
  items: ProjectStackItem[]
}

// Pin/stack unit is always a pair, on both desktop and tablet — only the
// *visual* column count changes per breakpoint (grid-cols-1 vs 2, below).
// Regrouping the pin units themselves per breakpoint would mean rebuilding
// the row DOM (and every ScrollTrigger) on resize; stacking 2 cards
// vertically inside one pinned unit on tablet gets the same "grid-cols-1"
// look the brief asks for without that fragility.
const ROW_SIZE = 2

export function ProjectsStack({ items }: ProjectsStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Array<HTMLDivElement | null>>([])
  const cardHandles = useRef<Array<ProjectCardHandle | null>>([])

  const rows = chunk(items, ROW_SIZE)

  useProjectsStackAnimation({
    containerRef,
    rowRefs,
    cardHandles,
    itemCount: items.length,
  })

  return (
    <div ref={containerRef} className="relative">
      {rows.map((row, rowIndex) => (
        <div
          key={row.map((item) => item.id).join("-")}
          ref={(el) => {
            rowRefs.current[rowIndex] = el
          }}
          // The pinned/covering element must be a full-bleed, fully opaque
          // block — the max-width content constraint lives on the inner
          // grid instead, so a covering row's background reaches the
          // viewport edges and nothing from the row underneath shows
          // through the side gutters while it's stacked on top.
          className="bg-brand-dark relative w-full py-10 lg:py-16"
        >
          <div className="mx-auto grid max-w-400 grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-2">
            {row.map((item, itemIndex) => {
              const index = rowIndex * ROW_SIZE + itemIndex

              return (
                <ProjectCard
                  key={item.id}
                  ref={(handle) => {
                    cardHandles.current[index] = handle
                  }}
                  item={item}
                  priority={index < 2}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
