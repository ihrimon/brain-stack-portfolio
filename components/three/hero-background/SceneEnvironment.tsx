"use client"

import { Environment, Lightformer } from "@react-three/drei"

/**
 * The scene's reflection/clearcoat environment, built entirely from virtual
 * light panels (`Lightformer`) baked into a cubemap once — not an external
 * HDRI file. This avoids a network fetch to a third-party asset host (drei's
 * HDRI presets are served from a public CDN) while still giving the blobs'
 * clearcoat and Fresnel response something believable to reflect.
 *
 * `frames={1}` bakes the cubemap a single time instead of re-rendering it
 * every frame — correct here because none of the Lightformers move.
 */
export function SceneEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#9ca3c2"
        position={[0, 4, -6]}
        scale={[8, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.35}
        color="#6b7294"
        position={[-6, -1, 4]}
        rotation={[0, Math.PI / 2.4, 0]}
        scale={[4, 4, 1]}
      />
      {/* Mirrors the top rect below the blobs so the baked cubemap wraps
          light from underneath too, not just top/right — dimmer than the
          top panel so it still reads as fill completing the wrap rather
          than a second competing key light. */}
      <Lightformer
        form="rect"
        intensity={0.6}
        color="#8b91ac"
        position={[0, -5, -6]}
        scale={[11, 11, 1]}
      />
      <Lightformer
        form="ring"
        intensity={0.3}
        color="#d8dbea"
        position={[5, 3, 5]}
        scale={5}
      />
    </Environment>
  )
}
