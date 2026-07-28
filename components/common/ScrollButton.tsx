"use client"

import { cn } from "@/lib/utils/cn"
import gsap from "gsap"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const BUTTON_SIZE = 56
const STROKE_WIDTH = 2
const RADIUS = (BUTTON_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const BACK_TO_TOP_THRESHOLD = 0.5
// Below this, treat progress as "0" so the ring/number don't flicker in from
// a single pixel of scroll right at the top of the page.
const SCROLL_START_THRESHOLD = 0.5
const SWAP_DURATION = 0.35

export function ScrollButton() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const iconRef = useRef<HTMLDivElement>(null)
  const percentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop = window.scrollY
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0

      setProgress(Math.min(100, Math.max(0, pct)))
      setScrolled(scrollTop > window.innerHeight * BACK_TO_TOP_THRESHOLD)
    }

    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    return () => {
      window.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [])

  const isScrolling = progress > SCROLL_START_THRESHOLD

  useEffect(() => {
    const icon = iconRef.current
    const percent = percentRef.current
    if (!icon || !percent) return

    gsap.to(icon, {
      opacity: isScrolling ? 0 : 1,
      scale: isScrolling ? 0.5 : 1,
      duration: SWAP_DURATION,
      ease: "power2.out",
    })
    gsap.to(percent, {
      opacity: isScrolling ? 1 : 0,
      scale: isScrolling ? 1 : 0.5,
      duration: SWAP_DURATION,
      ease: "power2.out",
    })
  }, [isScrolling])

  const handleClick = () => {
    if (scrolled) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
    }
  }

  const dashOffset = CIRCUMFERENCE * (1 - progress / 100)

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        scrolled ? "Scroll back to top" : "Scroll down to next section"
      }
      className="group fixed right-5 bottom-24 z-50 hidden size-14 cursor-pointer items-center justify-center rounded-full bg-surface-dark/90 text-white shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-neutral-800 sm:right-8 lg:flex lg:bottom-8 dark:bg-white/10 dark:hover:bg-white/20"
      data-cursor="magnetic"
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

      <div className="relative flex size-full items-center justify-center">
        <div
          ref={iconRef}
          className="absolute flex items-center justify-center"
        >
          <span className={cn(!scrolled && "animate-bounce")}>
            {scrolled ? (
              <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-1" />
            ) : (
              <ArrowDown className="size-5 transition-transform duration-300 group-hover:translate-y-1" />
            )}
          </span>
        </div>

        <div
          ref={percentRef}
          className="absolute text-xs font-semibold opacity-0"
        >
          {Math.round(progress)}%
        </div>
      </div>
    </button>
  )
}
