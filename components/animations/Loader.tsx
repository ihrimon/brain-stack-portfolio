"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef, useState } from "react"

gsap.registerPlugin(useGSAP)

export function Loader() {
  const [isDone, setIsDone] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (sessionStorage.getItem("bs-loaded")) {
      setIsDone(true)
      return
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const counter = { value: 0 }
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        sessionStorage.setItem("bs-loaded", "1")
        gsap.to(wrapperRef.current, {
          autoAlpha: 0,
          duration: prefersReducedMotion ? 0 : 0.6,
          onComplete: () => setIsDone(true),
        })
      },
    })

    tl.to(counter, {
      value: 100,
      duration: prefersReducedMotion ? 0 : 1.4,
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counter.value))
        }
        if (barRef.current) {
          barRef.current.style.width = `${counter.value}%`
        }
      },
    })
  }, [])

  if (isDone) return null

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-background"
      aria-hidden="true"
    >
      <span className="text-h4 font-semibold tracking-tight text-heading">
        Brain Stack
      </span>
      <div className="h-px w-40 overflow-hidden bg-border">
        <div
          ref={barRef}
          className="h-full w-0 bg-gradient-brand"
        />
      </div>
      <span className="font-mono text-sm text-label">
        <span ref={counterRef}>0</span>%
      </span>
    </div>
  )
}
