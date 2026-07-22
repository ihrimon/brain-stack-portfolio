import * as THREE from "three"

export type Tier = "desktop" | "tablet" | "mobile"

export const TABLET_BREAKPOINT_PX = 1024
export const MOBILE_BREAKPOINT_PX = 640

// Deep, dark "liquid glass / soft silicone" material shared by every blob.
// Reflections/rim color come entirely from the environment + lights below —
// keeping every blob the same near-black base is what makes them read as one
// coherent material family rather than five unrelated objects.
//
// Real transmission (not just a token amount) plus a mid-strength, low-
// roughness clearcoat is what reads as "liquid" rather than "matte stone":
// light actually passes through and scatters instead of only bouncing off
// an opaque surface, and the clearcoat gives one soft, continuous
// Fresnel-driven highlight rather than a chalky, even glow.
export const BLOB_MATERIAL = {
  color: new THREE.Color("#3A3B4F"),
  roughness: 0.3,
  metalness: 0,
  clearcoat: 0.4,
  clearcoatRoughness: 0.7,
  transmission: 0.22,
  ior: 1.5,
  thickness: 1.2,
  envMapIntensity: 0.85,
}

export interface BlobConfig {
  id: string
  position: [number, number, number]
  scale: number
  // Offsets the noise field per-blob so identical math never produces
  // identical motion — this is what makes five blobs read as independent
  // rather than a single shape instanced five times.
  seed: number
  noiseFreq: number
  noiseAmp: number
  morphSpeed: number
  floatSpeed: number
  floatAmplitude: number
  rotationSpeed: [number, number, number]
}

const DESKTOP_BLOBS: BlobConfig[] = [
  {
    id: "a",
    position: [-3.4, 0.6, -1.5],
    scale: 2.1,
    seed: 12.3,
    noiseFreq: 0.42,
    noiseAmp: 0.05,
    morphSpeed: 0.06,
    floatSpeed: 0.18,
    floatAmplitude: 0.28,
    rotationSpeed: [0.012, 0.018, 0.008],
  },
  {
    id: "b",
    position: [2.8, -0.8, -2.4],
    scale: 2.6,
    seed: 47.1,
    noiseFreq: 0.32,
    noiseAmp: 0.06,
    morphSpeed: 0.045,
    floatSpeed: 0.14,
    floatAmplitude: 0.32,
    rotationSpeed: [-0.009, 0.014, 0.011],
  },
  {
    id: "c",
    position: [0.4, 1.6, -3.6],
    scale: 1.6,
    seed: 8.8,
    noiseFreq: 0.5,
    noiseAmp: 0.04,
    morphSpeed: 0.07,
    floatSpeed: 0.22,
    floatAmplitude: 0.22,
    rotationSpeed: [0.016, -0.011, 0.013],
  },
  {
    id: "d",
    position: [-1.6, -1.7, -0.8],
    scale: 1.3,
    seed: 63.5,
    noiseFreq: 0.6,
    noiseAmp: 0.035,
    morphSpeed: 0.05,
    floatSpeed: 0.2,
    floatAmplitude: 0.2,
    rotationSpeed: [0.01, 0.02, -0.009],
  },
  {
    id: "e",
    position: [4.1, 1.4, -4.2],
    scale: 1.8,
    seed: 29.7,
    noiseFreq: 0.4,
    noiseAmp: 0.055,
    morphSpeed: 0.055,
    floatSpeed: 0.16,
    floatAmplitude: 0.26,
    rotationSpeed: [-0.013, 0.009, 0.017],
  },
]

// Tablet/mobile reuse the desktop blobs' individual tuning (seed, morph,
// float) and only override position/scale — trimming the *count* per
// breakpoint, not re-authoring each blob's character from scratch.
const TABLET_BLOBS: BlobConfig[] = [
  { ...DESKTOP_BLOBS[0], position: [-2.2, 0.7, -1.5] },
  { ...DESKTOP_BLOBS[1], position: [2, -0.9, -2.2] },
  { ...DESKTOP_BLOBS[2], position: [0.2, 1.9, -3] },
]

const MOBILE_BLOBS: BlobConfig[] = [
  { ...DESKTOP_BLOBS[0], position: [-1.1, 0.6, -1.5], scale: 1.9 },
  { ...DESKTOP_BLOBS[1], position: [1.2, -0.8, -2.2], scale: 2.1 },
]

export const BLOB_LAYOUTS: Record<Tier, BlobConfig[]> = {
  desktop: DESKTOP_BLOBS,
  tablet: TABLET_BLOBS,
  mobile: MOBILE_BLOBS,
}

// Icosahedron subdivision level. Higher = smoother, more continuous surface
// for the noise displacement to read as organic/liquid rather than
// faceted/low-poly.
export const GEOMETRY_DETAIL: Record<Tier, number> = {
  desktop: 5,
  tablet: 4,
  mobile: 3,
}

// `null` skips the bloom pass (and its extra full-screen render target)
// entirely rather than merely lowering intensity — mobile GPUs feel the cost
// of an extra composite pass far more than the visual loses from it.
export const BLOOM: Record<
  Tier,
  { strength: number; radius: number; threshold: number } | null
> = {
  desktop: { strength: 0.2, radius: 0.7, threshold: 0.92 },
  tablet: { strength: 0.16, radius: 0.65, threshold: 0.93 },
  mobile: null,
}

export const PARTICLE_COUNT: Record<Tier, number> = {
  desktop: 140,
  tablet: 90,
  mobile: 50,
}

// Tuned for "subtle, calm" per the brief — these were raised much higher
// while chasing down a pointer-events bug that silently swallowed every
// mouse move before it reached the canvas (fixed in HeroSection.tsx). Now
// that the cursor genuinely reaches the scene, the same motion reads as
// aggressive at that strength, so it's dialed back down.
export const MOUSE_LERP = 0.045
export const MOUSE_ROTATION_STRENGTH = 0.15
export const MOUSE_POSITION_STRENGTH = 0.35
