"use client"

import type { HeroMetricsData } from "@/lib/data/hero"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface HeroMetricsProps {
  data: HeroMetricsData
  className?: string
}

/** Three compact inline metrics — deliberately not stat cards. Values are
 * static (fixed business numbers, not something to "count up" toward) and
 * render immediately so they're never blank or shown as 0; a small stagger
 * pulse plays every few seconds as a quiet "still alive" signal. */
export function HeroMetrics({ data, className }: HeroMetricsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const valueEls =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-metric-value]")
      if (!valueEls || valueEls.length === 0) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const pulse = gsap.to(valueEls, {
          scale: 1.08,
          duration: 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          repeatDelay: 3,
          stagger: 0.4,
          delay: 2,
        })

        return () => pulse.kill()
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className={cn("grid grid-cols-3 items-start gap-x-3 gap-y-3 sm:gap-x-4", className)}
    >
      {data.map((metric, index) => (
        <div
          key={metric.title}
          className={cn(
            "flex min-w-0 items-center",
            index > 0 && "border-l border-white/10 pl-3 sm:pl-6"
          )}
        >
          <div className="flex min-w-0 flex-col">
            <div className="flex items-baseline gap-1.5 transition-transform duration-300 hover:-translate-y-1">
              <span className="flex items-baseline gap-0.5">
                <span
                  data-metric-value={metric.value}
                  className="text-xl font-bold text-white tabular-nums sm:text-2xl lg:text-4xl"
                >
                  {metric.value}
                </span>
                <span className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                  {metric.suffix}
                </span>
              </span>
              <span className="text-xs font-medium text-white/70 sm:text-sm lg:text-base">
                {metric.title}
              </span>
            </div>
            <span className="text-wrap mt-3 text-xs text-white/40 sm:text-sm lg:text-base">
              {metric.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
