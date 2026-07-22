"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

const PARTICLE_COUNT = 6

/**
 * Extremely subtle ambient background for the intelligence panel — a
 * faint grid, one static radial glow, and a handful of slow-drifting
 * dots. Everything here stays at very low opacity and animates only
 * `transform`/`opacity` (GPU-cheap), so it never competes with the
 * panel's real content.
 */
export function PanelBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const particles =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-particle]")
      if (!particles || particles.length === 0) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tweens = Array.from(particles).map((particle, index) =>
          gsap.to(particle, {
            y: -18 - index * 4,
            x: index % 2 === 0 ? 8 : -8,
            opacity: 0.35,
            duration: 4 + index * 0.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.4,
          })
        )

        return () => tweens.forEach((tween) => tween.kill())
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="absolute top-1/4 -left-1/4 size-[28rem] rounded-full opacity-[0.08] blur-3xl"
        style={{
          background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)",
        }}
      />

      {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
        <span
          key={index}
          data-particle
          className="absolute size-1 rounded-full bg-accent opacity-15"
          style={{
            left: `${12 + index * 15}%`,
            top: `${20 + ((index * 23) % 60)}%`,
          }}
        />
      ))}
    </div>
  )
}
