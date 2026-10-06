"use client"

import { cn } from "@/lib/utils/cn"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// Code-split: the field's JS isn't part of the page's initial bundle.
const NeuralField = dynamic(
  () => import("@/components/animations/NeuralField").then((mod) => mod.NeuralField),
  { ssr: false }
)

interface LazyNeuralFieldProps {
  className?: string
  /** Only mount at or above this viewport width (px). */
  minWidth?: number
  /** Wait this long after mount, then for the next idle moment. */
  delay?: number
}

/**
 * Above-the-fold wrapper for NeuralField. Nothing is downloaded, mounted or
 * drawn until the page has settled (delay + idle), and not at all below
 * `minWidth` — so the decorative field never competes with the hero's LCP or
 * with hydration on slower devices. It fades in once it appears.
 */
export function LazyNeuralField({ className, minWidth = 0, delay = 1200 }: LazyNeuralFieldProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (window.innerWidth < minWidth) return

    let idleHandle = 0
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleHandle = window.requestIdleCallback(() => setShow(true), { timeout: 1000 })
      } else {
        setShow(true)
      }
    }, delay)

    return () => {
      window.clearTimeout(timer)
      if (idleHandle) window.cancelIdleCallback(idleHandle)
    }
  }, [minWidth, delay])

  if (!show) return null

  return (
    <div className="animate-in fade-in absolute inset-0 duration-1000">
      <NeuralField className={cn(className)} />
    </div>
  )
}
