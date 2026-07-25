"use client"

import type { HeroMetricsData } from "@/lib/data/hero-panel"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface HeroMetricsProps {
  data: HeroMetricsData
  className?: string
}

/** Three compact inline metrics — deliberately not stat cards. Values
 * count up once on mount, then give a small stagger pulse every few
 * seconds as a quiet "still counting" signal. */
export function HeroMetrics({ data, className }: HeroMetricsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const valueEls =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-metric-value]")
      if (!valueEls || valueEls.length === 0) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        valueEls.forEach((el) => {
          const target = Number(el.dataset.metricValue)
          const counter = { value: 0 }
          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            delay: 0.2,
            onUpdate: () => {
              el.textContent = Math.round(counter.value).toString()
            },
          })
        })

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

      // Reduced motion still needs the real numbers on screen — just
      // without the animated count-up or pulse.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        valueEls.forEach((el) => {
          el.textContent = el.dataset.metricValue ?? "0"
        })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className={cn("grid grid-cols-3 items-start gap-x-3 gap-y-3 sm:gap-x-6", className)}
    >
      {data.map((metric, index) => (
        <div
          key={metric.label}
          className={cn(
            "flex min-w-0 items-center",
            index > 0 && "border-l border-white/10 pl-3 sm:pl-6"
          )}
        >
          <div className="flex min-w-0 flex-col">
            <div className="flex items-baseline gap-0.5 transition-transform duration-300 hover:-translate-y-0.5">
              <span
                data-metric-value={metric.value}
                className="text-xl font-bold text-white tabular-nums sm:text-2xl lg:text-3xl"
              >
                0
              </span>
              <span className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                {metric.suffix}
              </span>
            </div>
            <span className="text-wrap text-xs text-white/40 sm:text-sm lg:text-base">
              {metric.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
