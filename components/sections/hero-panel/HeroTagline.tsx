"use client"

import type { HeroTaglineData } from "@/lib/data/hero-panel"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ChevronRight } from "lucide-react"
import { useRef } from "react"

interface HeroTaglineProps {
  data: HeroTaglineData
  className?: string
}

const CHEVRONS_PER_CONNECTOR = 3

/** "Design → Develop → Automate", where each arrow is a small track of
 * chevrons endlessly flowing left-to-right — reads as data moving through
 * a pipeline rather than a static separator. Hovering the row both widens
 * the letter-spacing and draws in an underline. */
export function HeroTagline({ data, className }: HeroTaglineProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tracks =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-connector]")
      if (!tracks || tracks.length === 0) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tweens = Array.from(tracks).map((track) => {
          const chevrons = track.querySelectorAll("[data-chevron]")
          return gsap.fromTo(
            chevrons,
            { xPercent: -150, opacity: 0 },
            {
              xPercent: 350,
              opacity: 1,
              duration: 1.8,
              ease: "none",
              repeat: -1,
              stagger: 0.35,
            }
          )
        })

        return () => tweens.forEach((tween) => tween.kill())
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative inline-flex w-fit items-center text-sm font-semibold tracking-widest text-white/70 uppercase transition-[letter-spacing] duration-500 hover:tracking-[0.25em] sm:text-base",
        className
      )}
    >
      {data.map((step, index) => (
        <span key={step} className="flex items-center">
          {index > 0 && (
            <span
              data-connector
              aria-hidden="true"
              className="relative mx-2 h-4 w-10 overflow-hidden sm:w-14"
            >
              {Array.from({ length: CHEVRONS_PER_CONNECTOR }).map(
                (_, chevronIndex) => (
                  <ChevronRight
                    key={chevronIndex}
                    data-chevron
                    className="absolute top-1/2 left-0 size-4 -translate-y-1/2 text-accent"
                  />
                )
              )}
            </span>
          )}
          <span>{step}</span>
        </span>
      ))}

      <span
        aria-hidden="true"
        className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-accent/50 transition-transform duration-500 group-hover:scale-x-100"
      />
    </div>
  )
}
