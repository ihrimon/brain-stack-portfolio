"use client"

import { Canvas } from "@react-three/fiber"
import { useEffect, useState } from "react"
import { MOBILE_BREAKPOINT_PX, TABLET_BREAKPOINT_PX, type Tier } from "./constants"
import { Scene } from "./Scene"

function resolveTier(): Tier {
  if (typeof window === "undefined") return "desktop"
  if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches) {
    return "mobile"
  }
  if (window.matchMedia(`(max-width: ${TABLET_BREAKPOINT_PX}px)`).matches) {
    return "tablet"
  }
  return "desktop"
}

interface HeroBackgroundProps {
  className?: string
}

/**
 * Premium, GPU-rendered hero background: 4-5 slowly morphing matte-black
 * sculptural blobs lit by a baked Lightformer environment, with a soft
 * cursor-driven tilt and a barely-there bloom pass. Purely decorative
 * (`aria-hidden`) and meant to be absolutely positioned behind real HTML
 * content by the caller — no text is ever rendered inside the Canvas.
 *
 * Transparent (`alpha: true`) rather than painting its own background: the
 * caller (HeroSection.tsx) owns the dark gradient backdrop as a plain CSS
 * background so it's visible immediately, before this client-only bundle
 * has even loaded — see the `next/dynamic(..., { ssr: false })` import at
 * the call site, matching the BrainWireframe.tsx precedent for keeping
 * three.js out of the server bundle.
 */
export function HeroBackground({ className }: HeroBackgroundProps) {
  const [tier, setTier] = useState<Tier>(() => resolveTier())
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  useEffect(() => {
    const mobileQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT_PX}px)`
    )
    const tabletQuery = window.matchMedia(
      `(max-width: ${TABLET_BREAKPOINT_PX}px)`
    )
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateTier = () => setTier(resolveTier())
    const updateMotion = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches)

    mobileQuery.addEventListener("change", updateTier)
    tabletQuery.addEventListener("change", updateTier)
    motionQuery.addEventListener("change", updateMotion)

    return () => {
      mobileQuery.removeEventListener("change", updateTier)
      tabletQuery.removeEventListener("change", updateTier)
      motionQuery.removeEventListener("change", updateMotion)
    }
  }, [])

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <Scene key={tier} tier={tier} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
