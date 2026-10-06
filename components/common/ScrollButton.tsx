"use client"

import { getLenis } from "@/lib/animations/lenis"
import { cn } from "@/lib/utils/cn"
import { ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"

const BUTTON_SIZE = 56
const STROKE_WIDTH = 2
const RADIUS = (BUTTON_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** Shown once the visitor is half a screen down the page. */
const SHOW_AFTER = 0.5

/** Fired before jumping to the top, so anything holding the scroll (the
 * services section's step-by-step lock) can let go first. */
export const SCROLL_TO_TOP_EVENT = "brainstack:scroll-to-top"

/** Back-to-top button: a chevron inside a ring that fills with the page's
 * scroll progress. Click goes straight to the top. */
export function ScrollButton() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId: number | null = null

    const update = () => {
      rafId = null
      const scrollTop = window.scrollY
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
      setVisible(scrollTop > window.innerHeight * SHOW_AFTER)
    }

    // Coalesced to one update per frame: this is mounted once in the root
    // layout, so it runs on every page.
    const requestUpdate = () => {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  const scrollToTop = () => {
    window.dispatchEvent(new Event(SCROLL_TO_TOP_EVENT))
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const dashOffset = CIRCUMFERENCE * (1 - progress / 100)

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "group fixed right-5 bottom-24 z-50 hidden size-14 cursor-pointer items-center justify-center rounded-full bg-surface-dark/90 text-white shadow-lg backdrop-blur transition-[opacity,translate,background-color] duration-500 ease-premium hover:bg-neutral-800 sm:right-8 lg:bottom-8 lg:flex",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <svg
        className="pointer-events-none absolute inset-0 size-full -rotate-90"
        viewBox={`0 0 ${BUTTON_SIZE} ${BUTTON_SIZE}`}
        aria-hidden="true"
      >
        <circle
          cx={BUTTON_SIZE / 2}
          cy={BUTTON_SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          className="stroke-white/10"
        />
        <circle
          cx={BUTTON_SIZE / 2}
          cy={BUTTON_SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="stroke-brand-primary transition-[stroke-dashoffset] duration-200 ease-out"
        />
      </svg>

      <ChevronUp
        aria-hidden="true"
        className="relative size-6 transition-transform duration-500 ease-premium group-hover:-translate-y-1"
        strokeWidth={1.8}
      />
    </button>
  )
}
