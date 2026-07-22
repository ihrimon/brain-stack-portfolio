"use client"

import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface AnimatedDividerProps {
  className?: string
}

/**
 * A hairline divider with a soft cyan highlight that sweeps across it on a
 * slow, endless loop — reads as ambient "still working" motion rather than
 * a static rule. Fully self-contained (owns its own GSAP loop) so it can be
 * dropped between any two panel sections with no external wiring.
 */
export function AnimatedDivider({ className }: AnimatedDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          glowRef.current,
          { xPercent: -120 },
          {
            xPercent: 220,
            duration: 4.5,
            ease: "sine.inOut",
            repeat: -1,
            repeatDelay: 1.5,
          }
        )

        return () => tween.kill()
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("relative h-px w-full overflow-hidden bg-white/10", className)}
    >
      <span
        ref={glowRef}
        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent/80 to-transparent"
      />
    </div>
  )
}
