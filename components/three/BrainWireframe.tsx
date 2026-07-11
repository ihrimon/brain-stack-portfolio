"use client"

import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import { Canvas, useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react"
import * as THREE from "three"

gsap.registerPlugin(ScrollTrigger)

// -----------------------------------------------------------------------------
// Tuning constants — every number the scene depends on lives here so the
// look and feel can be adjusted in one place instead of hunting through the
// component tree for magic numbers.
// -----------------------------------------------------------------------------

const COLORS = {
  primaryGlow: new THREE.Color("#5b5fff"),
  secondaryGlow: new THREE.Color("#8b5cf6"),
  accent: new THREE.Color("#22d3ee"),
  nodeWhite: new THREE.Color("#f5f7ff"),
}

// How many nodes make up the point cloud. Mobile gets fewer to keep frame
// time low on weaker GPUs while still reading as "hundreds of nodes".
const NODE_COUNT_DESKTOP = 320
const NODE_COUNT_MOBILE = 180
const MOBILE_BREAKPOINT_PX = 640

// Proportions of each hemisphere lobe (a squashed Fibonacci sphere) and how
// far apart the two lobes sit — these are what make the point cloud read
// as an abstract brain rather than a plain sphere.
const LOBE_WIDTH = 0.62
const LOBE_HEIGHT = 1
const LOBE_DEPTH = 0.78
const LOBE_OFFSET = 0.34
const LOBE_TAPER_STRENGTH = 0.4

// Neural connections between nearby nodes.
const CONNECTION_DISTANCE = 0.34
const MAX_CONNECTIONS_PER_NODE = 3
const LINE_BASE_OPACITY = 0.12
const LINE_HOVER_OPACITY_BOOST = 0.1

// Animated "data" traveling along a handful of connections.
const PULSE_COUNT = 10
const PULSE_SPEED = 0.35
const PULSE_SIZE = 0.05

// Node appearance + motion.
const BASE_NODE_SIZE = 0.028
const BASE_ROTATION_SPEED = 0.045
const FLOAT_AMPLITUDE = 0.05
const FLOAT_SPEED = 0.5
const BLINK_SPEED = 1.4
const BLINK_INTENSITY = 0.4
const BREATH_SPEED = 0.6
const BREATH_INTENSITY = 0.22

// Cursor interaction.
const MOUSE_ROTATION_STRENGTH = 0.35
const MOUSE_LERP_SPEED = 0.06
const HOVER_GLOW_BOOST = 0.6
const HOVER_TRANSITION_DURATION = 0.6

// The faint outer geometric shell that gives the piece depth and a
// "containment field" feel.
const SHELL_RADIUS = 1.28
const SHELL_ROTATION_SPEED = -0.02
const SHELL_OPACITY = 0.1

// -----------------------------------------------------------------------------
// Geometry generation — pure functions, no Three.js scene graph involved.
// -----------------------------------------------------------------------------

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

/**
 * Builds an abstract, twin-lobe "brain" point cloud with no external model
 * or texture. Each hemisphere is an evenly distributed Fibonacci sphere,
 * squashed into brain-like proportions and tapered on the underside (a
 * stand-in for the brainstem) — deliberately geometric and abstract rather
 * than an anatomical reproduction.
 */
function generateBrainPoints(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const perLobe = Math.floor(count / 2)

  let cursor = 0
  for (let lobe = 0; lobe < 2; lobe++) {
    const side = lobe === 0 ? -1 : 1

    for (let i = 0; i < perLobe; i++) {
      const y = 1 - (i / (perLobe - 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = GOLDEN_ANGLE * i

      let x = Math.cos(theta) * radiusAtY * LOBE_WIDTH
      let z = Math.sin(theta) * radiusAtY * LOBE_DEPTH
      const py = y * LOBE_HEIGHT

      // Narrow the underside so the shape tapers like a brainstem instead
      // of staying a plain lobe all the way down.
      if (py < 0) {
        const taper = 1 + py * LOBE_TAPER_STRENGTH
        x *= taper
        z *= taper
      }

      positions[cursor * 3] = x + side * LOBE_OFFSET
      positions[cursor * 3 + 1] = py
      positions[cursor * 3 + 2] = z
      cursor++
    }
  }

  return positions
}

/**
 * Connects nearby nodes with straight segments, capped per-node so density
 * stays readable — and the line buffer stays bounded — even as the node
 * count grows. This runs once per mount on a few hundred points, not per
 * frame, so the O(n²) distance check is cheap enough to leave un-optimized.
 */
function buildConnections(
  positions: Float32Array,
  maxDistance: number,
  maxPerNode: number
): { segments: Float32Array; pairs: [number, number][] } {
  const count = positions.length / 3
  const pairs: [number, number][] = []
  const connectionCounts = new Array(count).fill(0)

  for (let i = 0; i < count; i++) {
    if (connectionCounts[i] >= maxPerNode) continue

    const ix = positions[i * 3]
    const iy = positions[i * 3 + 1]
    const iz = positions[i * 3 + 2]

    for (let j = i + 1; j < count; j++) {
      if (connectionCounts[i] >= maxPerNode) break
      if (connectionCounts[j] >= maxPerNode) continue

      const dx = ix - positions[j * 3]
      const dy = iy - positions[j * 3 + 1]
      const dz = iz - positions[j * 3 + 2]
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (distance < maxDistance) {
        pairs.push([i, j])
        connectionCounts[i]++
        connectionCounts[j]++
      }
    }
  }

  const segments = new Float32Array(pairs.length * 6)
  pairs.forEach(([a, b], index) => {
    segments[index * 6] = positions[a * 3]
    segments[index * 6 + 1] = positions[a * 3 + 1]
    segments[index * 6 + 2] = positions[a * 3 + 2]
    segments[index * 6 + 3] = positions[b * 3]
    segments[index * 6 + 4] = positions[b * 3 + 1]
    segments[index * 6 + 5] = positions[b * 3 + 2]
  })

  return { segments, pairs }
}

// A soft radial-gradient sprite used as every point's `map`, so each node
// reads as a small glow rather than a hard-edged dot. Generated once on the
// client and cached — cheaper than shipping a texture asset.
let glowTextureCache: THREE.Texture | null = null

function getGlowTexture(): THREE.Texture {
  if (glowTextureCache) return glowTextureCache

  const size = 64
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
    gradient.addColorStop(0, "rgba(255,255,255,1)")
    gradient.addColorStop(0.4, "rgba(255,255,255,0.6)")
    gradient.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }

  glowTextureCache = new THREE.CanvasTexture(canvas)
  return glowTextureCache
}

// -----------------------------------------------------------------------------
// Scene pieces — everything below is rendered inside the R3F <Canvas>.
// -----------------------------------------------------------------------------

interface BrainNodesProps {
  positions: Float32Array
  hoverIntensityRef: RefObject<number>
  reducedMotion: boolean
}

/** The glowing node point-cloud: a soft shared "breathing" pulse plus a
 * randomized per-node blink, both skipped entirely when the visitor
 * prefers reduced motion. */
function BrainNodes({ positions, hoverIntensityRef, reducedMotion }: BrainNodesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const count = positions.length / 3
  const glowTexture = useMemo(() => getGlowTexture(), [])

  // Random per-node phase + base color, generated exactly once per mount.
  // The parent forces a remount (via `key={nodeCount}`) whenever the node
  // count changes, so a plain lazy useState initializer is the correct,
  // React-Compiler-safe place for this one-time randomness — unlike
  // useMemo, which implies a pure/re-derivable cache of its inputs.
  const [{ phases, baseColorArray }] = useState(() => {
    const phases = new Float32Array(count)
    const baseColorArray = new Float32Array(count * 3)
    const tempColor = new THREE.Color()

    for (let i = 0; i < count; i++) {
      phases[i] = Math.random() * Math.PI * 2

      // Mostly white/blue nodes with occasional purple/cyan accents.
      const roll = Math.random()
      if (roll < 0.72) tempColor.copy(COLORS.nodeWhite)
      else if (roll < 0.88) tempColor.copy(COLORS.primaryGlow)
      else if (roll < 0.96) tempColor.copy(COLORS.secondaryGlow)
      else tempColor.copy(COLORS.accent)

      tempColor.toArray(baseColorArray, i * 3)
    }

    return { phases, baseColorArray }
  })

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const geometry = pointsRef.current?.geometry
    if (!geometry) return

    // Mutate the GPU buffer's own backing array directly (reached through
    // the Three.js object, not the React state variable) — `baseColorArray`
    // above is only ever read here, never written to.
    const attribute = geometry.attributes.color as THREE.BufferAttribute
    const colorArray = attribute.array as Float32Array

    const time = clock.getElapsedTime()
    const breathing = 1 + Math.sin(time * BREATH_SPEED) * BREATH_INTENSITY
    const hoverBoost = 1 + hoverIntensityRef.current * HOVER_GLOW_BOOST

    for (let i = 0; i < count; i++) {
      const blink = 1 - BLINK_INTENSITY + Math.sin(time * BLINK_SPEED + phases[i]) * BLINK_INTENSITY
      const brightness = breathing * blink * hoverBoost

      colorArray[i * 3] = baseColorArray[i * 3] * brightness
      colorArray[i * 3 + 1] = baseColorArray[i * 3 + 1] * brightness
      colorArray[i * 3 + 2] = baseColorArray[i * 3 + 2] * brightness
    }

    attribute.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        {/* A copy, not `baseColorArray` itself — the GPU buffer gets its own
            array to mutate every frame, decoupled from the state value. */}
        <bufferAttribute attach="attributes-color" args={[baseColorArray.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={BASE_NODE_SIZE}
        map={glowTexture}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

interface BrainConnectionsProps {
  segments: Float32Array
  hoverIntensityRef: RefObject<number>
}

/** Thin lines between nearby nodes — the "circuit board" / neural-network
 * read of the piece. Opacity nudges up slightly on hover. */
function BrainConnections({ segments, hoverIntensityRef }: BrainConnectionsProps) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null)

  useFrame(() => {
    if (!materialRef.current) return
    materialRef.current.opacity =
      LINE_BASE_OPACITY + hoverIntensityRef.current * LINE_HOVER_OPACITY_BOOST
  })

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[segments, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color="#ffffff"
        transparent
        opacity={LINE_BASE_OPACITY}
        depthWrite={false}
      />
    </lineSegments>
  )
}

interface DataPulsesProps {
  pairs: [number, number][]
  positions: Float32Array
  reducedMotion: boolean
}

/** A handful of bright points that travel back and forth along random
 * connections, reading as "data" moving through the network. */
function DataPulses({ pairs, positions, reducedMotion }: DataPulsesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const glowTexture = useMemo(() => getGlowTexture(), [])

  // Assigned once per mount for the same reason as BrainNodes' colors above:
  // this is one-time randomness, not a re-derivable cache, so it belongs in
  // a lazy useState initializer rather than useMemo.
  const [pulses] = useState(() => {
    if (pairs.length === 0) return []
    return Array.from({ length: PULSE_COUNT }, () => ({
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      offset: Math.random(),
    }))
  })

  const positionArray = useMemo(() => new Float32Array(PULSE_COUNT * 3), [])

  useFrame(({ clock }) => {
    const geometry = pointsRef.current?.geometry
    if (!geometry) return

    const time = clock.getElapsedTime()

    pulses.forEach((pulse, i) => {
      const [a, b] = pulse.pair
      const t = (time * PULSE_SPEED + pulse.offset) % 1

      positionArray[i * 3] = THREE.MathUtils.lerp(positions[a * 3], positions[b * 3], t)
      positionArray[i * 3 + 1] = THREE.MathUtils.lerp(
        positions[a * 3 + 1],
        positions[b * 3 + 1],
        t
      )
      positionArray[i * 3 + 2] = THREE.MathUtils.lerp(
        positions[a * 3 + 2],
        positions[b * 3 + 2],
        t
      )
    })

    const attribute = geometry.attributes.position as THREE.BufferAttribute
    attribute.needsUpdate = true
  })

  // A static frame of moving light doesn't read as anything meaningful, so
  // skip pulses entirely rather than freezing them mid-travel.
  if (reducedMotion || pulses.length === 0) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positionArray, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={PULSE_SIZE}
        map={glowTexture}
        color="#22d3ee"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

interface BrainShellProps {
  reducedMotion: boolean
}

/** A faint wireframe icosahedron surrounding the brain — a cheap way to
 * add geometric depth and a "containment field" read without any extra
 * texture or shader work. */
function BrainShell({ reducedMotion }: BrainShellProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (reducedMotion || !meshRef.current) return
    meshRef.current.rotation.y += SHELL_ROTATION_SPEED * delta
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[SHELL_RADIUS, 1]} />
      <meshStandardMaterial
        color={COLORS.primaryGlow}
        emissive={COLORS.primaryGlow}
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={SHELL_OPACITY}
        roughness={0.5}
        metalness={0.2}
      />
    </mesh>
  )
}

interface BrainGroupProps {
  positions: Float32Array
  segments: Float32Array
  pairs: [number, number][]
  mouseRef: RefObject<{ x: number; y: number }>
  hoverIntensityRef: RefObject<number>
  reducedMotion: boolean
}

/** Owns the whole-brain motion: slow autonomous spin, a gentle vertical
 * float, and a tilt that eases toward the cursor and back. */
function BrainGroup({
  positions,
  segments,
  pairs,
  mouseRef,
  hoverIntensityRef,
  reducedMotion,
}: BrainGroupProps) {
  const groupRef = useRef<THREE.Group>(null)
  const tilt = useRef({ x: 0, y: 0 })

  useFrame(({ clock }, delta) => {
    const group = groupRef.current
    if (!group) return

    if (!reducedMotion) {
      group.rotation.y += BASE_ROTATION_SPEED * delta
      group.position.y = Math.sin(clock.getElapsedTime() * FLOAT_SPEED) * FLOAT_AMPLITUDE

      tilt.current.x = THREE.MathUtils.lerp(
        tilt.current.x,
        mouseRef.current.y * MOUSE_ROTATION_STRENGTH,
        MOUSE_LERP_SPEED
      )
      tilt.current.y = THREE.MathUtils.lerp(
        tilt.current.y,
        mouseRef.current.x * MOUSE_ROTATION_STRENGTH,
        MOUSE_LERP_SPEED
      )
    }

    group.rotation.x = tilt.current.x
    group.rotation.z = -tilt.current.y * 0.3
  })

  return (
    <group ref={groupRef}>
      <BrainShell reducedMotion={reducedMotion} />
      <BrainConnections segments={segments} hoverIntensityRef={hoverIntensityRef} />
      <BrainNodes
        positions={positions}
        hoverIntensityRef={hoverIntensityRef}
        reducedMotion={reducedMotion}
      />
      <DataPulses pairs={pairs} positions={positions} reducedMotion={reducedMotion} />
    </group>
  )
}

type SceneProps = BrainGroupProps

function Scene(props: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 3]} intensity={0.8} color={COLORS.secondaryGlow} />
      <BrainGroup {...props} />
    </>
  )
}

// -----------------------------------------------------------------------------
// Public component
// -----------------------------------------------------------------------------

interface BrainWireframeProps {
  className?: string
}

/**
 * A procedural, twin-lobe wireframe "brain" — no external 3D model or
 * texture required. Renders as a glowing node network with animated data
 * pulses, floats and spins slowly on its own, leans gently toward the
 * cursor on hover, and reveals itself on scroll via GSAP.
 */
export function BrainWireframe({ className }: BrainWireframeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const hoverIntensityRef = useRef(0)

  // Read the real media-query state up front (lazy initializer, so it only
  // runs once) rather than defaulting and syncing in an effect — that way
  // the very first client render is already correct instead of needing a
  // follow-up state update.
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
  const [nodeCount, setNodeCount] = useState(() => {
    if (typeof window === "undefined") return NODE_COUNT_DESKTOP
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches
      ? NODE_COUNT_MOBILE
      : NODE_COUNT_DESKTOP
  })

  // The effect's only job is keeping state in sync with *later* changes —
  // an OS-level reduced-motion toggle, or the viewport crossing the mobile
  // breakpoint — via listener callbacks, not a synchronous setState call in
  // the effect body itself.
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sizeQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`)

    const handleMotionChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    const handleSizeChange = (event: MediaQueryListEvent) =>
      setNodeCount(event.matches ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP)

    motionQuery.addEventListener("change", handleMotionChange)
    sizeQuery.addEventListener("change", handleSizeChange)
    return () => {
      motionQuery.removeEventListener("change", handleMotionChange)
      sizeQuery.removeEventListener("change", handleSizeChange)
    }
  }, [])

  const { positions, segments, pairs } = useMemo(() => {
    const positions = generateBrainPoints(nodeCount)
    const { segments, pairs } = buildConnections(
      positions,
      CONNECTION_DISTANCE,
      MAX_CONNECTIONS_PER_NODE
    )
    return { positions, segments, pairs }
  }, [nodeCount])

  // Scroll-triggered reveal, matching the fade/scale-in language the rest
  // of the site's sections use.
  useGSAP(
    () => {
      if (!wrapperRef.current) return

      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            once: true,
          },
        }
      )
    },
    { scope: wrapperRef }
  )

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      y: -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
    }
  }, [])

  const handlePointerEnter = useCallback(() => {
    gsap.to(hoverIntensityRef, {
      current: 1,
      duration: HOVER_TRANSITION_DURATION,
      ease: "power2.out",
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    gsap.to(hoverIntensityRef, {
      current: 0,
      duration: HOVER_TRANSITION_DURATION,
      ease: "power2.out",
    })
    mouseRef.current = { x: 0, y: 0 }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={cn("relative h-full w-full", className)}
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Soft ambient glow behind the canvas — plain CSS, no extra draw calls. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(91,95,255,0.35), rgba(139,92,246,0.2) 45%, transparent 70%)",
        }}
      />

      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Keying on nodeCount forces a clean remount (fresh random colors/
            phases/pulse assignments) on the rare occasion the responsive
            node count actually changes, instead of trying to patch stale
            per-node state in place. */}
        <Scene
          key={nodeCount}
          positions={positions}
          segments={segments}
          pairs={pairs}
          mouseRef={mouseRef}
          hoverIntensityRef={hoverIntensityRef}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}
