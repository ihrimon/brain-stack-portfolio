"use client"

import { ProjectCard, type ProjectCardHandle } from "@/components/projects/ProjectCard"
import { useProjectsStackAnimation } from "@/hooks/useProjectsStackAnimation"
import { chunk, type ProjectStackItem } from "@/lib/projects"
import { cn } from "@/lib/utils/cn"
import { useRef } from "react"

interface ProjectsStackProps {
  items: ProjectStackItem[]
}

// Stack unit is always a pair, on both desktop and tablet — only the
// *visual* column count changes per breakpoint (grid-cols-1 vs 2, below).
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
          // From `sm:` up, useProjectsStackAnimation.ts pins every row but
          // the last for a scroll distance equal to its own height, with
          // `pinSpacing: false` — so no extra space is reserved after it,
          // and the next row (later in DOM, higher z-index) sits only its
          // own height away in the document. The small negative top margin
          // below pulls each row up just enough to arrive a little *before*
          // the previous row's pin ends, so the two overlap for a beat and
          // the later one visibly slides up to cover the current one,
          // instead of only handing off once the current one has fully
          // scrolled away. Kept within the row's own py padding, so it's
          // invisible in the static (unpinned) layout — mobile, print, or
          // before JS runs.
          className={cn(
            "bg-brand-dark relative w-full py-10 lg:py-16",
            rowIndex > 0 && "sm:-mt-10 lg:-mt-16"
          )}
          style={{ zIndex: rowIndex + 1 }}
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
