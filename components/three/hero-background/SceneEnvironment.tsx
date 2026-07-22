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
        intensity={2.2}
        color="#7c8cff"
        position={[0, 4, -6]}
        scale={[8, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#22d3ee"
        position={[-6, -1, 4]}
        rotation={[0, Math.PI / 2.4, 0]}
        scale={[4, 4, 1]}
      />
      <Lightformer
        form="ring"
        intensity={1.1}
        color="#ffffff"
        position={[5, 3, 5]}
        scale={5}
      />
    </Environment>
  )
}
