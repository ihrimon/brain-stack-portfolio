"use client"

import { setLenis } from "@/lib/lenis"
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

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
