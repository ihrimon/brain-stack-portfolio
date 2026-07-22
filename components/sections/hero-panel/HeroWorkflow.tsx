"use client"

import type { HeroWorkflowData } from "@/lib/data/hero-panel"
import { cn } from "@/lib/utils/cn"
import { useEffect, useState } from "react"

interface HeroWorkflowProps {
  data: HeroWorkflowData
  className?: string
}

const STEP_INTERVAL_MS = 2000

/**
 * A live-looking pipeline: one step is "active" at a time (glowing dot,
 * brighter label, a lit connector reaching toward the next step), and the
 * active step advances automatically every 2s. Hovering a step reveals its
 * status badge and gives it a soft glow.
 *
 * The connector segments double as the "flowing light" cue — the segment
 * leaving the active dot lights up, which reads as motion travelling
 * toward the next step as `activeIndex` advances, without a second
 * separate animation system layered on top.
 */
export function HeroWorkflow({ data, className }: HeroWorkflowProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches)
    query.addEventListener("change", handleChange)
    return () => query.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % data.length)
    }, STEP_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion, data.length])

  return (
    <div
      role="list"
      aria-label="Live workflow"
      className={cn(
        "flex flex-col sm:flex-row sm:flex-wrap lg:flex-col lg:flex-nowrap",
        className
      )}
    >
      {data.map((step, index) => {
        const isActive = index === activeIndex
        const isLast = index === data.length - 1

        return (
          <div
            key={step.label}
            data-workflow-step
            role="listitem"
            className="group flex items-stretch gap-4 sm:min-w-32 sm:flex-1 sm:flex-col sm:items-center sm:gap-2 lg:min-w-0 lg:flex-none lg:flex-row lg:items-stretch"
          >
            <div className="flex flex-col items-center sm:w-full sm:flex-row lg:w-auto lg:flex-col">
              <span className="relative flex size-2.5 shrink-0 items-center justify-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 rounded-full transition-transform duration-500",
                    isActive ? "scale-[2.8] bg-accent/20" : "scale-100"
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative size-2.5 rounded-full transition-colors duration-500",
                    isActive
                      ? "bg-accent shadow-[0_0_10px_2px_rgba(34,211,238,0.55)]"
                      : "bg-white/20"
                  )}
                />
              </span>

              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-px flex-1 transition-colors duration-700 sm:h-px sm:w-full lg:h-auto lg:w-px",
                    isActive ? "bg-accent/50" : "bg-white/10"
                  )}
                />
              )}
            </div>

            <div
              className={cn(
                "relative flex flex-col pb-6 sm:items-center sm:pb-0 sm:text-center lg:items-start lg:pb-6 lg:text-left",
                isLast && "pb-0 lg:pb-0"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium tracking-wide uppercase transition-all duration-500 group-hover:scale-105",
                  isActive ? "text-white" : "text-white/35"
                )}
              >
                {step.label}
              </span>

              <span
                className={cn(
                  "pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider whitespace-nowrap text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  "sm:top-full sm:left-1/2 sm:mt-1 sm:ml-0 sm:-translate-x-1/2 sm:translate-y-0"
                )}
              >
                {step.status}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
