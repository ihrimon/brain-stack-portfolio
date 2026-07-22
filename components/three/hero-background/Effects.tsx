"use client"

import { useThree, useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

interface EffectsProps {
  strength: number
  radius: number
  threshold: number
}

/**
 * A barely-there bloom pass built directly on three.js's own postprocessing
 * examples (bundled with `three`, already a dependency here) instead of
 * `@react-three/postprocessing` — same visual result, no extra package.
 *
 * Subscribing a `useFrame` callback with render priority `1` hands the
 * frame's render call to this component entirely: react-three-fiber skips
 * its own default `gl.render(scene, camera)` whenever any subscriber has a
 * priority above 0 (see the R3F manual-render-loop docs), so the composer
 * becomes the only thing driving output.
 */
export function Effects({ strength, radius, threshold }: EffectsProps) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  const bloomRef = useRef<UnrealBloomPass | null>(null)

  useEffect(() => {
    const composer = new EffectComposer(gl)
    composer.addPass(new RenderPass(scene, camera))

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      strength,
      radius,
      threshold
    )
    composer.addPass(bloomPass)
    composer.addPass(new OutputPass())

    composer.setPixelRatio(gl.getPixelRatio())
    composer.setSize(size.width, size.height)

    composerRef.current = composer
    bloomRef.current = bloomPass

    return () => {
      composer.dispose()
      composerRef.current = null
      bloomRef.current = null
    }
    // Bloom tuning (strength/radius/threshold) is applied imperatively in the
    // effect below rather than tearing down and rebuilding the whole
    // composer whenever it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera])

  useEffect(() => {
    composerRef.current?.setPixelRatio(gl.getPixelRatio())
    composerRef.current?.setSize(size.width, size.height)
  }, [gl, size])

  useEffect(() => {
    const bloomPass = bloomRef.current
    if (!bloomPass) return
    bloomPass.strength = strength
    bloomPass.radius = radius
    bloomPass.threshold = threshold
  }, [strength, radius, threshold])

  useFrame(
    (_, delta) => {
      composerRef.current?.render(delta)
    },
    1
  )

  return null
}
