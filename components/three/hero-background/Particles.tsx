"use client"

import { useFrame } from "@react-three/fiber"
import { useMemo, useRef, useState } from "react"
import * as THREE from "three"

interface ParticlesProps {
  count: number
  reducedMotion: boolean
}

// A small soft-glow sprite, generated once on the client rather than shipped
// as a texture asset — the same trick BrainWireframe.tsx uses for its node
// glow, kept local here since the two components don't share a module.
function createGlowSprite(): THREE.Texture {
  const size = 32
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    )
    gradient.addColorStop(0, "rgba(255,255,255,0.9)")
    gradient.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }

  return new THREE.CanvasTexture(canvas)
}

/** A sparse, low-opacity dust field drifting almost imperceptibly around the
 * blobs — purely atmospheric per the brief ("support the composition rather
 * than distract"), never more than a faint hint of depth. */
export function Particles({ count, reducedMotion }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const texture = useMemo(() => createGlowSprite(), [])

  const [{ positions, basePositions, phases, speeds }] = useState(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = 0.05 + Math.random() * 0.08
    }

    return { positions, basePositions: positions.slice(), phases, speeds }
  })

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const geometry = pointsRef.current?.geometry
    if (!geometry) return

    const attribute = geometry.attributes.position as THREE.BufferAttribute
    const array = attribute.array as Float32Array
    const t = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      array[i * 3] =
        basePositions[i * 3] + Math.cos(t * speeds[i] * 0.7 + phases[i]) * 0.25
      array[i * 3 + 1] =
        basePositions[i * 3 + 1] + Math.sin(t * speeds[i] + phases[i]) * 0.4
    }

    attribute.needsUpdate = true
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        map={texture}
        color="#c7d2ff"
        transparent
        opacity={0.22}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
