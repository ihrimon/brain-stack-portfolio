"use client"

import { setLenis } from "@/lib/animations/lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Lenis from "lenis"
import { useEffect } from "react"

gsap.registerPlugin(ScrollTrigger)

interface SmoothScrollProps {
  children: React.ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) return

    // `lerp` (frame-rate-independent damping) instead of `duration`/`easing`:
    // a fixed 1.2s ease restarted on every wheel tick, so scrolling kept
    // drifting long after the wheel stopped and felt like it was dragging
    // between sections. Scrubbed ScrollTriggers stacked their own lag on top.
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
    })

    lenis.on("scroll", ScrollTrigger.update)
    setLenis(lenis)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(update)
      setLenis(undefined)
    }
  }, [])

  return <>{children}</>
}
