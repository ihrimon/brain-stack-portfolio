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
          // OUTER: a plain block in normal document flow. Its extra
          // bottom padding (beyond the sticky row's own height) is what
          // gives the row real scroll room to hold in place before the
          // next row's turn to stick and cover it — sticky positioning has
          // nothing to hold against without that slack. No buffer after
          // the last row: nothing needs to cover it.
          className={cn(rowIndex < rows.length - 1 && "sm:pb-[40vh]")}
        >
          <div
            ref={(el) => {
              rowRefs.current[rowIndex] = el
            }}
            // INNER: the actual visible, stacking row. `sticky` only from
            // `sm:` up (640px) — below that it's `static`, a plain block
            // in the mobile fallback list, matching where the hook's own
            // mobile branch switches to the fade-up reveal. Every row
            // sticks at the *same* `top: 0` — a later row is later in DOM
            // order and has a higher z-index, so once it reaches the top
            // it fully covers the row underneath rather than leaving a
            // permanent sliver visible.
            className="bg-brand-dark relative top-0 w-full py-10 sm:sticky lg:py-16"
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
        </div>
      ))}
    </div>
  )
}
