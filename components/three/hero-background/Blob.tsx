"use client"

import { useFrame } from "@react-three/fiber"
import type { RefObject } from "react"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { WebGLProgramParametersWithUniforms } from "three"
import { simplexNoise3D } from "./shaders/simplexNoise3D"
import {
  BLOB_MATERIAL,
  MOUSE_LERP,
  MOUSE_POSITION_STRENGTH,
  MOUSE_ROTATION_STRENGTH,
  type BlobConfig,
} from "./constants"

interface BlobUniforms {
  uTime: { value: number }
  uNoiseFreq: { value: number }
  uNoiseAmp: { value: number }
  uSeed: { value: number }
}

/**
 * Extends the compiled MeshPhysicalMaterial shader (via `onBeforeCompile`)
 * with GPU-side simplex-noise vertex displacement, rather than writing a
 * bespoke lighting shader — this keeps the physically-based
 * clearcoat/transmission/Fresnel response (and its interaction with the
 * baked environment) intact, and only the vertex stage is touched.
 *
 * The displaced normal is reconstructed from two extra noise samples along
 * tangent directions (a finite-difference estimate: displace two nearby
 * points, take the cross product of the resulting tangent vectors) rather
 * than left as the undisplaced geometry normal — at this displacement
 * amplitude the mismatch would otherwise be visible as flat-looking
 * highlights on what should read as a soft, bumpy surface.
 *
 * Defined at module scope with no closure over component state: three.js
 * calls this with `this` bound to the material being compiled, so the
 * per-blob uniform cells it creates are reached afterward through
 * `material.userData.shader.uniforms` from `useFrame` — never through a
 * value returned by a hook, which the project's React Compiler lint rules
 * treat as off-limits to mutate.
 */
function onBeforeCompile(
  this: THREE.MeshPhysicalMaterial,
  shader: WebGLProgramParametersWithUniforms
) {
  const uniforms: BlobUniforms = {
    uTime: { value: 0 },
    uNoiseFreq: { value: 1 },
    uNoiseAmp: { value: 0.15 },
    uSeed: { value: 0 },
  }
  Object.assign(shader.uniforms, uniforms)

  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      `#include <common>
      uniform float uTime;
      uniform float uNoiseFreq;
      uniform float uNoiseAmp;
      uniform float uSeed;
      ${simplexNoise3D}
      // Domain-warped noise: sample a low-frequency vector field, use it to
      // bend the coordinates fed into a second noise sample. A single plain
      // octave of simplex noise reads as isotropic round bumps — "stone".
      // Warping the input first is what turns that into the long, flowing,
      // vein-like ridges a satin/liquid surface actually has.
      float blobDisplacement(vec3 p) {
        vec3 pos = p * uNoiseFreq + uSeed;
        float t = uTime * 0.06;
        vec3 warp = vec3(
          snoise(pos * 0.6 + vec3(0.0, 0.0, t)),
          snoise(pos * 0.6 + vec3(37.2, 11.3, t)),
          snoise(pos * 0.6 + vec3(5.7, 91.2, t))
        );
        return snoise(pos + warp * 1.2 + t);
      }`
    )
    .replace(
      "#include <beginnormal_vertex>",
      `
      float dispEpsilon = 0.02;
      vec3 tangentU = normalize(abs(normal.y) < 0.999 ? cross(normal, vec3(0.0, 1.0, 0.0)) : cross(normal, vec3(1.0, 0.0, 0.0)));
      vec3 tangentV = normalize(cross(normal, tangentU));

      float dispBase = blobDisplacement(position);
      vec3 posBase = position + normal * dispBase * uNoiseAmp;

      float dispU = blobDisplacement(position + tangentU * dispEpsilon);
      vec3 posU = position + tangentU * dispEpsilon + normal * dispU * uNoiseAmp;

      float dispV = blobDisplacement(position + tangentV * dispEpsilon);
      vec3 posV = position + tangentV * dispEpsilon + normal * dispV * uNoiseAmp;

      vec3 objectNormal = normalize(cross(posU - posBase, posV - posBase));
      `
    )
    .replace("#include <begin_vertex>", `vec3 transformed = posBase;`)

  this.userData.shader = shader
}

interface BlobProps {
  config: BlobConfig
  detail: number
  mouseRef: RefObject<{ x: number; y: number }>
  reducedMotion: boolean
}

/** One floating, slowly morphing sculptural blob. Owns its own material
 * instance (so `uTime`/noise uniforms stay per-blob) but the geometry is a
 * plain icosahedron — all of the "organic" character comes from the shader,
 * not the base mesh. */
export function Blob({ config, detail, mouseRef, reducedMotion }: BlobProps) {
  const groupRef = useRef<THREE.Group>(null)
  // Not disposed on unmount: unlike the geometry (recreated whenever
  // `detail` changes across a breakpoint), this material is cheap (no
  // textures, one small shader) and its compiled WebGLProgram is shared
  // across every blob with identical shader text regardless — the disposal
  // cost isn't worth the extra ref plumbing for how rarely this unmounts.
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const spin = useRef({ x: 0, y: 0, z: 0 })
  const tilt = useRef({ x: 0, y: 0 })

  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1, detail),
    [detail]
  )

  useEffect(() => {
    return () => geometry.dispose()
  }, [geometry])

  // Each blob reacts to the cursor a little differently — scaled by its own
  // seed — so the whole field doesn't lean toward the pointer in lockstep.
  const mouseInfluence = 0.5 + (config.seed % 10) / 20
  const tiltLerp = MOUSE_LERP + (config.seed % 10) / 400

  useFrame(({ clock }, delta) => {
    // `onBeforeCompile` only fires once the renderer first compiles this
    // material (lazily, on its first frame) — `shader` is undefined for
    // exactly that one frame, which is imperceptible to skip.
    const shader = materialRef.current?.userData.shader as
      | { uniforms: BlobUniforms }
      | undefined

    if (shader) {
      shader.uniforms.uNoiseFreq.value = config.noiseFreq
      shader.uniforms.uNoiseAmp.value = config.noiseAmp
      shader.uniforms.uSeed.value = config.seed
      if (!reducedMotion) {
        shader.uniforms.uTime.value += delta * config.morphSpeed
      }
    }

    if (!reducedMotion) {
      spin.current.x += config.rotationSpeed[0] * delta * 10
      spin.current.y += config.rotationSpeed[1] * delta * 10
      spin.current.z += config.rotationSpeed[2] * delta * 10

      tilt.current.x = THREE.MathUtils.lerp(
        tilt.current.x,
        mouseRef.current.y * MOUSE_ROTATION_STRENGTH * mouseInfluence,
        tiltLerp
      )
      tilt.current.y = THREE.MathUtils.lerp(
        tilt.current.y,
        mouseRef.current.x * MOUSE_ROTATION_STRENGTH * mouseInfluence,
        tiltLerp
      )
    }

    const group = groupRef.current
    if (!group) return

    group.rotation.set(
      spin.current.x + tilt.current.x,
      spin.current.y + tilt.current.y,
      spin.current.z
    )

    const t = clock.getElapsedTime()
    const floatY = reducedMotion
      ? 0
      : Math.sin(t * config.floatSpeed + config.seed) * config.floatAmplitude

    group.position.set(
      config.position[0] +
        (reducedMotion
          ? 0
          : mouseRef.current.x * MOUSE_POSITION_STRENGTH * mouseInfluence),
      config.position[1] +
        floatY +
        (reducedMotion
          ? 0
          : mouseRef.current.y * MOUSE_POSITION_STRENGTH * mouseInfluence * 0.6),
      config.position[2]
    )
  })

  return (
    <group ref={groupRef} position={config.position} scale={config.scale}>
      <mesh geometry={geometry} frustumCulled={false}>
        <meshPhysicalMaterial
          ref={materialRef}
          {...BLOB_MATERIAL}
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>
    </group>
  )
}
