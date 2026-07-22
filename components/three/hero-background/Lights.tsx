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
      <ambientLight intensity={0.55} color="#3a4361" />
      <directionalLight
        ref={rimLightRef}
        position={[3.5, 2.5, 4]}
        intensity={1.3}
        color="#4fd1ff"
      />
      <rectAreaLight
        position={[-4.5, 3, -2]}
        rotation={[0, Math.PI / 4, 0]}
        width={7}
        height={7}
        intensity={4}
        color="#5b5fff"
      />
      <rectAreaLight
        position={[3, -2.5, 2]}
        rotation={[0, -Math.PI / 3, 0]}
        width={5}
        height={5}
        intensity={1.6}
        color="#22d3ee"
      />
    </>
  )
}
