"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { MOUSE_LERP } from "./constants"

/**
 * Smoothed cursor position in NDC space (-1..1), read from R3F's own
 * `state.pointer` — already tracked via a listener Canvas attaches to its
 * DOM element — rather than adding a second manual `pointermove` listener.
 * Returned as a ref (not state) so consumers can read it inside `useFrame`
 * without subscribing to re-renders.
 */
export function useMouseTracker() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    mouseRef.current.x = THREE.MathUtils.lerp(
      mouseRef.current.x,
      state.pointer.x,
      MOUSE_LERP
    )
    mouseRef.current.y = THREE.MathUtils.lerp(
      mouseRef.current.y,
      state.pointer.y,
      MOUSE_LERP
    )
  })

  return mouseRef
}
