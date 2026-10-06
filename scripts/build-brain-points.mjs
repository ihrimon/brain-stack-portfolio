// Builds public/models/brain-points.bin from scripts/assets/brain.glb.
//
// Source model: "Brain" by Poly by Google — https://poly.pizza/m/5mPRPZkI3qt
// License: CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/).
// Attribution is shown in the site footer.
//
// Instead of shipping the GLB plus a 3D engine to the browser, this samples
// points evenly over the mesh surface (area-weighted), keeps each point's
// surface normal, and precomputes a sparse "neural" link graph — packed into
// one small binary the hero's canvas renderer reads directly.
//
// Run: node scripts/build-brain-points.mjs
//
// Binary layout (little-endian):
//   u32 pointCount, u32 linkCount
//   i16 × 3 × pointCount   positions, normalized to [-1, 1] × 32767
//   i8  × 3 × pointCount   unit normals × 127
//   (pad to 2-byte boundary)
//   u16 × 2 × linkCount    point-index pairs

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const SRC = path.join(root, "scripts/assets/brain.glb")
const OUT = path.join(root, "public/models/brain-points.bin")

const POINTS = 5200
const NEURONS = 900 // subset of points that get links
const LINKS_PER_NEURON = 2

// ---- read GLB -------------------------------------------------------------
const glb = fs.readFileSync(SRC)
if (glb.toString("ascii", 0, 4) !== "glTF") throw new Error("not a GLB")
const jsonLen = glb.readUInt32LE(12)
const gltf = JSON.parse(glb.toString("utf8", 20, 20 + jsonLen))
const bin = glb.subarray(20 + jsonLen + 8)

function accessor(i) {
  const a = gltf.accessors[i]
  const view = gltf.bufferViews[a.bufferView]
  const offset = bin.byteOffset + (view.byteOffset ?? 0) + (a.byteOffset ?? 0)
  const comps = { SCALAR: 1, VEC2: 2, VEC3: 3 }[a.type]
  const Type = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array }[a.componentType]
  return new Type(bin.buffer, offset, a.count * comps)
}

// ---- collect triangles (all meshes/primitives) ----------------------------
const tris = []
for (const mesh of gltf.meshes) {
  for (const prim of mesh.primitives) {
    const pos = accessor(prim.attributes.POSITION)
    const idx = prim.indices !== undefined ? accessor(prim.indices) : null
    const count = idx ? idx.length / 3 : pos.length / 9
    const v = (k) => [pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]]
    for (let t = 0; t < count; t++) {
      const A = v(idx ? idx[t * 3] : t * 3)
      const B = v(idx ? idx[t * 3 + 1] : t * 3 + 1)
      const C = v(idx ? idx[t * 3 + 2] : t * 3 + 2)
      const u = B.map((x, k) => x - A[k])
      const w = C.map((x, k) => x - A[k])
      const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
      const len = Math.hypot(...n) || 1
      tris.push({ A, B, C, area: len / 2, normal: n.map((x) => x / len) })
    }
  }
}

// ---- area-weighted surface sampling (deterministic) -----------------------
let seed = 20261006
const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
const total = tris.reduce((s, t) => s + t.area, 0)
const cdf = []
let running = 0
for (const t of tris) cdf.push((running += t.area / total))

const pts = []
const nrm = []
for (let i = 0; i < POINTS; i++) {
  const r = rand()
  let lo = 0
  let hi = cdf.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (cdf[mid] < r) lo = mid + 1
    else hi = mid
  }
  const t = tris[lo]
  let s1 = rand()
  let s2 = rand()
  if (s1 + s2 > 1) {
    s1 = 1 - s1
    s2 = 1 - s2
  }
  pts.push([0, 1, 2].map((k) => t.A[k] + (t.B[k] - t.A[k]) * s1 + (t.C[k] - t.A[k]) * s2))
  nrm.push(t.normal)
}

// ---- normalize: center on bbox, scale longest half-extent to 1 ------------
const min = [0, 1, 2].map((k) => Math.min(...pts.map((p) => p[k])))
const max = [0, 1, 2].map((k) => Math.max(...pts.map((p) => p[k])))
const center = min.map((m, k) => (m + max[k]) / 2)
const half = Math.max(...max.map((m, k) => (m - min[k]) / 2))
const norm = pts.map((p) => p.map((x, k) => (x - center[k]) / half))

// ---- sparse neural links among a subset of points -------------------------
const neurons = []
for (let i = 0; i < NEURONS; i++) neurons.push(Math.floor(rand() * POINTS))
const linkSet = new Set()
const links = []
const MAX_D = 0.22
for (const a of neurons) {
  const d = neurons
    .filter((b) => b !== a)
    .map((b) => [b, Math.hypot(...norm[a].map((x, k) => x - norm[b][k]))])
    .filter(([, dist]) => dist < MAX_D)
    .sort((x, y) => x[1] - y[1])
    .slice(0, LINKS_PER_NEURON)
  for (const [b] of d) {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (linkSet.has(key)) continue
    linkSet.add(key)
    links.push([a, b])
  }
}

// ---- pack ------------------------------------------------------------------
const headerBytes = 8
const posBytes = POINTS * 3 * 2
const nrmBytes = POINTS * 3
const pad = (headerBytes + posBytes + nrmBytes) % 2
const linkBytes = links.length * 2 * 2
const out = Buffer.alloc(headerBytes + posBytes + nrmBytes + pad + linkBytes)
let o = 0
out.writeUInt32LE(POINTS, o); o += 4
out.writeUInt32LE(links.length, o); o += 4
for (const p of norm) for (const x of p) { out.writeInt16LE(Math.round(x * 32767), o); o += 2 }
for (const n of nrm) for (const x of n) { out.writeInt8(Math.round(x * 127), o); o += 1 }
o += pad
for (const [a, b] of links) { out.writeUInt16LE(a, o); o += 2; out.writeUInt16LE(b, o); o += 2 }

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, out)
console.log(`brain-points.bin: ${POINTS} points, ${links.length} links, ${out.length} bytes`)
console.log("extent after normalize:", [0, 1, 2].map((k) => [Math.min(...norm.map((p) => p[k])).toFixed(2), Math.max(...norm.map((p) => p[k])).toFixed(2)]))
