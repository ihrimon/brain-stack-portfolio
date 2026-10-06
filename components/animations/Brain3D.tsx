"use client"

import { cn } from "@/lib/utils/cn"
import { useEffect, useRef } from "react"

// -----------------------------------------------------------------------------
// A real 3D brain, rendered as a holographic point cloud.
//
// Geometry comes from "Brain" by Poly by Google (CC BY 3.0, credited in the
// footer), pre-sampled by scripts/build-brain-points.mjs into
// /models/brain-points.bin: ~5k surface points with normals plus a sparse
// link graph. No 3D engine — a hand-rolled perspective projection on a 2D
// canvas, drawn in a handful of batched passes.
//
// It turns toward the pointer anywhere over the enclosing section (yaw on X,
// pitch on Y) and sways gently when idle. Points at the silhouette glow
// brightest (a Fresnel-style rim), a scan line sweeps through it, and pulses
// travel along the links. Pauses off-screen / in background tabs; reduced
// motion gets a single still frame. Theme-aware via --signal / --paper.
// -----------------------------------------------------------------------------

const MODEL_URL = "/models/brain-points.bin"
const CAMERA_Z = 3.4
const BUCKETS = 6

interface Model {
  count: number
  pos: Float32Array // xyz, normalized [-1, 1]
  nrm: Float32Array // xyz unit normals
  links: Uint16Array // pairs
  adjacency: number[][] // point → link indices
}

async function loadModel(stride: number): Promise<Model> {
  const buf = await (await fetch(MODEL_URL)).arrayBuffer()
  const view = new DataView(buf)
  const total = view.getUint32(0, true)
  const linkCount = view.getUint32(4, true)
  const posRaw = new Int16Array(buf, 8, total * 3)
  const nrmRaw = new Int8Array(buf, 8 + total * 6, total * 3)
  const linkOffset = 8 + total * 6 + total * 3 + ((8 + total * 9) % 2)
  const linkRaw = new Uint16Array(buf.slice(linkOffset, linkOffset + linkCount * 4))

  // `stride` thins the cloud on small screens; links keep their original
  // indices, so remap them onto the kept points (dropping orphaned ones).
  const keep = new Int32Array(total).fill(-1)
  let count = 0
  for (let i = 0; i < total; i += stride) keep[i] = count++
  const pos = new Float32Array(count * 3)
  const nrm = new Float32Array(count * 3)
  for (let i = 0; i < total; i++) {
    const k = keep[i]
    if (k < 0) continue
    for (let c = 0; c < 3; c++) {
      pos[k * 3 + c] = posRaw[i * 3 + c] / 32767
      nrm[k * 3 + c] = nrmRaw[i * 3 + c] / 127
    }
  }
  const kept: number[] = []
  for (let l = 0; l < linkCount; l++) {
    const a = keep[linkRaw[l * 2]]
    const b = keep[linkRaw[l * 2 + 1]]
    if (a >= 0 && b >= 0) kept.push(a, b)
  }
  const links = Uint16Array.from(kept)
  const adjacency: number[][] = Array.from({ length: count }, () => [])
  for (let l = 0; l < links.length / 2; l++) {
    adjacency[links[l * 2]].push(l)
    adjacency[links[l * 2 + 1]].push(l)
  }
  return { count, pos, nrm, links, adjacency }
}

function parseHex(value: string, fallback: [number, number, number]) {
  const hex = value.trim().replace("#", "")
  if (!/^[0-9a-f]{6}$/i.test(hex)) return fallback
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
}

interface Pulse {
  link: number
  from: number
  t: number
}

interface Brain3DProps {
  className?: string
  /** Vertical center of the brain within the canvas, 0–1 (default 0.5). */
  centerY?: number
}

export function Brain3D({ className, centerY = 0.5 }: Brain3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const host = canvas?.closest("section") ?? canvas?.parentElement
    if (!canvas || !ctx || !host) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let disposed = false
    let model: Model | null = null

    let width = 0
    let height = 0
    let dpr = 1
    let signal: [number, number, number] = [47, 91, 255]
    let dark = true

    // Projected buffers, sized once the model loads.
    let sx = new Float32Array(0)
    let sy = new Float32Array(0)
    let depth = new Float32Array(0)
    const buckets: number[][] = Array.from({ length: BUCKETS }, () => [])

    const readColors = () => {
      const style = getComputedStyle(canvas)
      signal = parseHex(style.getPropertyValue("--signal"), signal)
      const [r, g, b] = parseHex(style.getPropertyValue("--paper"), [10, 10, 10])
      dark = 0.2126 * r + 0.7152 * g + 0.0722 * b < 128
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }

    // Pointer → target rotation, eased every frame.
    let targetX = 0
    let targetY = 0
    let tiltX = 0
    let tiltY = 0
    const pulses: Pulse[] = []

    const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

    const draw = (time: number, dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      if (!model) return
      const m = model
      const t = time / 1000

      const glow: [number, number, number] = dark
        ? [Math.min(255, signal[0] + 70), Math.min(255, signal[1] + 80), 255]
        : signal
      const core: [number, number, number] = dark ? [228, 236, 255] : [22, 48, 190]

      // A 3/4 view by default (front-left, slightly from above), swaying
      // gently, plus the pointer offset.
      const yaw = -0.62 + Math.sin(t * 0.35) * 0.12 + tiltX * 0.75
      const pitch = 0.32 + Math.sin(t * 0.27 + 1) * 0.05 + tiltY * 0.4
      const cy = Math.cos(yaw)
      const syaw = Math.sin(yaw)
      const cp = Math.cos(pitch)
      const sp = Math.sin(pitch)
      const scale = Math.min(width, height * 1.25) * 0.42 * CAMERA_Z
      const ox = width / 2
      const oy = height * centerY

      // Scan line sweeping top → bottom in model space.
      const scan = ((t * 0.18) % 1.4) * 2 - 1.2

      for (const b of buckets) b.length = 0
      for (let i = 0; i < m.count; i++) {
        const x = m.pos[i * 3]
        const y = m.pos[i * 3 + 1]
        const z = m.pos[i * 3 + 2]
        // yaw (around Y), then pitch (around X)
        const x1 = x * cy + z * syaw
        const z1 = -x * syaw + z * cy
        const y2 = y * cp - z1 * sp
        const z2 = y * sp + z1 * cp
        const persp = scale / (CAMERA_Z - z2)
        sx[i] = ox + x1 * persp
        sy[i] = oy - y2 * persp
        depth[i] = (z2 + 1) / 2

        // Normal's facing toward the camera → rim factor.
        const nx = m.nrm[i * 3]
        const ny = m.nrm[i * 3 + 1]
        const nz = m.nrm[i * 3 + 2]
        const nz1 = -nx * syaw + nz * cy
        const nz2 = ny * sp + nz1 * cp
        const rim = 1 - Math.min(1, Math.abs(nz2))
        const scanBoost = Math.max(0, 1 - Math.abs(y - scan) / 0.07)
        const l = Math.min(1, 0.12 + rim * rim * 0.75 + depth[i] * 0.2 + scanBoost * 0.7)
        buckets[Math.min(BUCKETS - 1, Math.floor(l * BUCKETS))].push(i)
      }

      ctx.globalCompositeOperation = dark ? "lighter" : "source-over"

      // Links (faint), batched in two depth bands.
      ctx.lineWidth = 0.6
      for (const band of [0, 1]) {
        ctx.strokeStyle = rgba(glow, dark ? 0.1 + band * 0.12 : 0.08 + band * 0.1)
        ctx.beginPath()
        for (let l = 0; l < m.links.length / 2; l++) {
          const a = m.links[l * 2]
          const b = m.links[l * 2 + 1]
          if ((depth[a] + depth[b] > 1 ? 1 : 0) !== band) continue
          ctx.moveTo(sx[a], sy[a])
          ctx.lineTo(sx[b], sy[b])
        }
        ctx.stroke()
      }

      // Points, one fillStyle per brightness bucket.
      buckets.forEach((list, b) => {
        const l = (b + 0.5) / BUCKETS
        const color = l > 0.75 ? core : glow
        ctx.fillStyle = rgba(color, dark ? 0.18 + l * 0.75 : 0.28 + l * 0.65)
        const r = (dark ? 0.55 : 0.7) + l * 1.1
        for (const i of list) ctx.fillRect(sx[i] - r, sy[i] - r, r * 2, r * 2)
      })

      // Pulses hopping link to link.
      if (dt > 0 && m.links.length) {
        while (pulses.length < 14) {
          const link = Math.floor(Math.random() * (m.links.length / 2))
          pulses.push({ link, from: m.links[link * 2], t: Math.random() })
        }
        for (const p of pulses) {
          p.t += dt * 1.6
          while (p.t >= 1) {
            p.t -= 1
            const a = m.links[p.link * 2]
            const b = m.links[p.link * 2 + 1]
            const reached = p.from === a ? b : a
            const next = m.adjacency[reached].filter((l) => l !== p.link)
            if (next.length === 0 || Math.random() < 0.15) {
              p.link = Math.floor(Math.random() * (m.links.length / 2))
              p.from = m.links[p.link * 2]
            } else {
              p.link = next[Math.floor(Math.random() * next.length)]
              p.from = reached
            }
          }
          const a = p.from
          const b = m.links[p.link * 2] === a ? m.links[p.link * 2 + 1] : m.links[p.link * 2]
          const x = sx[a] + (sx[b] - sx[a]) * p.t
          const y = sy[a] + (sy[b] - sy[a]) * p.t
          const halo = ctx.createRadialGradient(x, y, 0, x, y, 8)
          halo.addColorStop(0, rgba(core, 0.95))
          halo.addColorStop(0.35, rgba(glow, 0.5))
          halo.addColorStop(1, rgba(glow, 0))
          ctx.fillStyle = halo
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalCompositeOperation = "source-over"
    }

    let frame = 0
    let last = 0
    let running = false
    let inView = false

    const tick = (now: number) => {
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000 || 0))
      last = now
      tiltX += (targetX - tiltX) * Math.min(1, dt * 3)
      tiltY += (targetY - tiltY) * Math.min(1, dt * 3)
      draw(now, dt)
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (running || reducedMotion || !model) return
      running = true
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    readColors()
    resize()

    const stride = window.innerWidth < 768 ? 2 : 1
    loadModel(stride)
      .then((loaded) => {
        if (disposed) return
        model = loaded
        sx = new Float32Array(loaded.count)
        sy = new Float32Array(loaded.count)
        depth = new Float32Array(loaded.count)
        draw(0, 0)
        if (inView && !document.hidden) start()
      })
      .catch(() => {
        // Decorative only — if the asset fails to load, show nothing.
      })

    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (!running) draw(0, 0)
    })
    resizeObserver.observe(canvas)

    const themeObserver = new MutationObserver(() => {
      readColors()
      if (!running) draw(0, 0)
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView && !document.hidden) start()
      else stop()
    })
    visibility.observe(canvas)

    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else if (inView) start()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1
    }
    const onPointerLeave = () => {
      targetX = 0
      targetY = 0
    }
    host.addEventListener("pointermove", onPointerMove)
    host.addEventListener("pointerleave", onPointerLeave)

    return () => {
      disposed = true
      stop()
      resizeObserver.disconnect()
      themeObserver.disconnect()
      visibility.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      host.removeEventListener("pointermove", onPointerMove)
      host.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [centerY])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  )
}
