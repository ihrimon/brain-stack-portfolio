"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// Code-split: the renderer's JS isn't part of the page's initial bundle.
const Brain3D = dynamic(
  () => import("@/components/animations/Brain3D").then((mod) => mod.Brain3D),
  { ssr: false }
)

interface LazyBrain3DProps {
  className?: string
  centerY?: number
  /** Wait this long after mount, then for the next idle moment. */
  delay?: number
}

/**
 * Above-the-fold wrapper for Brain3D: nothing (code, model file, rendering)
 * is loaded until the page has settled, so the hero headline's LCP and
 * hydration never compete with it. Fades in once it appears.
 */
export function LazyBrain3D({ className, centerY, delay = 900 }: LazyBrain3DProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
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
  }, [delay])

  if (!show) return null

  return (
    <div className="animate-in fade-in absolute inset-0 duration-1000">
      <Brain3D className={className} centerY={centerY} />
    </div>
  )
}
