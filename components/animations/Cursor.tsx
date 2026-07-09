"use client"

import gsap from "gsap"
import { useEffect, useRef } from "react"

/**
 * Decorative dot+ring that follows the pointer alongside the normal OS
 * cursor (not a replacement for it). Hover targets opt in with
 * `data-cursor="magnetic" | "view" | "text"` and an optional
 * `data-cursor-text="Label"`. Hidden on coarse pointers / reduced motion via
 * the `cursor-root` CSS rules in globals.css — kept out of React state so
 * mount doesn't trigger a synchronous re-render.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!isFinePointer || prefersReducedMotion) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const moveDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" })
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" })
    const moveRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" })
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" })

    const onMouseMove = (e: MouseEvent) => {
      moveDot(e.clientX)
      moveDotY(e.clientY)
      moveRing(e.clientX)
      moveRingY(e.clientY)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]"
      )
      if (!target) return

      const variant = target.dataset.cursor
      const text = target.dataset.cursorText

      if (labelRef.current) labelRef.current.textContent = text ?? ""

      gsap.to(ring, {
        scale: variant === "text" ? 3 : variant === "view" ? 2.4 : 1.6,
        duration: 0.3,
        ease: "power3.out",
      })
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]"
      )
      if (!target) return

      if (labelRef.current) labelRef.current.textContent = ""
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3.out" })
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    window.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseout", onMouseOut)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseout", onMouseOut)
    }
  }, [])

  return (
    <div
      className="cursor-root pointer-events-none fixed inset-0 z-100"
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-primary/50"
      >
        <span
          ref={labelRef}
          className="text-[10px] font-medium tracking-wide text-heading uppercase"
        />
      </div>
    </div>
  )
}
