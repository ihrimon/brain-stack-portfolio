"use client"

import { ProjectCard, type ProjectCardHandle } from "@/components/projects/ProjectCard"
import { useProjectsStackAnimation } from "@/hooks/useProjectsStackAnimation"
import { chunk, type ProjectStackItem } from "@/lib/projects"
import { useRef } from "react"

interface ProjectsStackProps {
  items: ProjectStackItem[]
}

// Stack unit is always a pair, on both desktop and tablet — only the
// *visual* column count changes per breakpoint (grid-cols-1 vs 2, below).
const ROW_SIZE = 2

export function ProjectsStack({ items }: ProjectsStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRefs = useRef<Array<HTMLDivElement | null>>([])
  const rowRefs = useRef<Array<HTMLDivElement | null>>([])
  const overlayRefs = useRef<Array<HTMLDivElement | null>>([])
  const glowRefs = useRef<Array<HTMLDivElement | null>>([])
  const cardHandles = useRef<Array<ProjectCardHandle | null>>([])

  const rows = chunk(items, ROW_SIZE)

  useProjectsStackAnimation({
    containerRef,
    stageRefs,
    rowRefs,
    overlayRefs,
    glowRefs,
    cardHandles,
    itemCount: items.length,
  })

  return (
    <div ref={containerRef} className="relative">
      {rows.map((row, rowIndex) => {
        const isLast = rowIndex === rows.length - 1

        return (
          <div
            key={row.map((item) => item.id).join("-")}
            ref={(el) => {
              stageRefs.current[rowIndex] = el
            }}
            className="relative"
          >
            <div
              ref={(el) => {
                rowRefs.current[rowIndex] = el
              }}
              // `sm:sticky sm:top-0` is the entire mechanism: each row pins
              // itself to the viewport top the moment it reaches it, and —
              // because it's later in DOM (so paints above earlier rows by
              // default) and given an explicit ascending z-index below for
              // safety once the opacity tweens create their own stacking
              // contexts — the *next* row rising up from the document flow
              // beneath it naturally slides up and over it, opaque
              // `bg-brand-dark` and all, purely from native scroll + sticky.
              // No JS ever touches position/transform here.
              className="bg-brand-dark relative w-full py-10 sm:sticky sm:top-0 lg:py-16"
              style={{ zIndex: rowIndex + 1 }}
            >
              {/* Ambient glow/shadow frame that fades in while this row is
                  the one rising to cover the previous one — see "entering"
                  tween in useProjectsStackAnimation. Sits behind the cards. */}
              <div
                ref={(el) => {
                  glowRefs.current[rowIndex] = el
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-5 inset-y-6 opacity-0 sm:inset-x-8 lg:inset-y-10"
                style={{
                  borderRadius: "1.5rem",
                  boxShadow: "0 60px 140px -40px rgba(0,0,0,0.75)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              />

              <div className="relative mx-auto grid max-w-400 grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-2">
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

              {/* Darkens this row very slightly as the next one rises to
                  cover it — keeps depth readable without touching the
                  cards' own opacity/scale (those stay owned by ProjectCard's
                  `data-active` hover styles). */}
              <div
                ref={(el) => {
                  overlayRefs.current[rowIndex] = el
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-black opacity-0"
              />
            </div>

            {/* Scroll "dwell" — gives each row a beat fully stuck at the top
                before the next one begins rising over it. Not present after
                the last row: nothing needs to cover it, it just hands off to
                whatever section follows. */}
            {!isLast && (
              <div aria-hidden="true" className="hidden sm:block sm:h-[40vh] lg:h-[35vh]" />
            )}
          </div>
        )
      })}
    </div>
  )
}
