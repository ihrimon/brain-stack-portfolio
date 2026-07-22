"use client"

import { useFrame } from "@react-three/fiber"
import type { RefObject } from "react"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js"

// `rectAreaLight` needs its LTC lookup textures initialized once before any
// area light renders correctly — module-scope flag so remounting this
// component (e.g. the `key={tier}` remount on breakpoint change) doesn't
// redo the work.
let rectAreaLightUniformsInitialized = false

interface LightsProps {
  mouseRef: RefObject<{ x: number; y: number }>
  reducedMotion: boolean
}

/** Ambient fill + a directional rim light that drifts gently toward the
 * cursor + two static area lights standing in for soft studio panels. No
 * shadow casting anywhere — this scene relies on the environment map and
 * clearcoat response for depth, not cast shadows. */
export function Lights({ mouseRef, reducedMotion }: LightsProps) {
  const rimLightRef = useRef<THREE.DirectionalLight>(null)

  useEffect(() => {
    if (rectAreaLightUniformsInitialized) return
    RectAreaLightUniformsLib.init()
    rectAreaLightUniformsInitialized = true
  }, [])

  useFrame(() => {
    const rimLight = rimLightRef.current
    if (reducedMotion || !rimLight) return

    rimLight.position.x = THREE.MathUtils.lerp(
      rimLight.position.x,
      3.5 + mouseRef.current.x * 1.4,
      0.05
    )
    rimLight.position.y = THREE.MathUtils.lerp(
      rimLight.position.y,
      2.5 + mouseRef.current.y * 1,
      0.05
    )
  })

  return (
    <>
      <ambientLight intensity={0.35} color="#12141c" />
      <directionalLight
        ref={rimLightRef}
        position={[3.5, 2.5, 4]}
        intensity={0.3}
        color="#c7cce0"
      />
      {/* One dominant soft key light — this is what reads as the single
          clean highlight arc across each blob. The second area light below
          is a much dimmer fill so it doesn't compete and split the
          highlight into several smaller, "stone-like" patches. Both kept
          near-white (rather than the saturated blue/cyan this used to be)
          to match a near-monochrome dark-glass reference, and dialed well
          down in intensity — full brightness turned the sphere silhouettes
          into a hot glossy rim, whereas the reference keeps its edges
          almost as dark as the background with only a faint, soft sheen. */}
      <rectAreaLight
        position={[-4.5, 3, -2]}
        rotation={[0, Math.PI / 4, 0]}
        width={16}
        height={16}
        intensity={1.7}
        color="#c2c6da"
      />
      <rectAreaLight
        position={[3, -2.5, 2]}
        rotation={[0, -Math.PI / 3, 0]}
        width={10}
        height={10}
        intensity={0.3}
        color="#7d84a0"
      />
    </>
  )
}
