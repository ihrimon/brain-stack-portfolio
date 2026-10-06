"use client"

import { cn } from "@/lib/utils/cn"
import { useEffect, useRef } from "react"

// -----------------------------------------------------------------------------
// A full-bleed "neural field" background in the same visual language as the
// Who We Are brain: drifting neurons joined by faint links, synapses that
// fire as short-lived lightning arcs between neighbours, and pulses of light
// travelling along the links. Neurons near the pointer brighten.
//
// Plain 2D canvas, no library. Pauses off-screen and in background tabs;
// reduced-motion visitors get a single still frame. Theme-aware: on dark it
// blends additively with white-hot cores; on light paper it switches to
// normal blending with deep-blue cores so it stays visible.
// -----------------------------------------------------------------------------

type P = [number, number]

interface Neuron {
  x: number
  y: number
  vx: number
  vy: number
}

interface Arc {
  a: number
  b: number
  age: number
  life: number
  seed: number
}

interface Pulse {
  a: number
  b: number
  t: number
  speed: number
}

const DENSITY = 1 / 16000 // neurons per px²
const MAX_NEURONS = 90

function parseHex(value: string, fallback: [number, number, number]) {
  const hex = value.trim().replace("#", "")
  if (!/^[0-9a-f]{6}$/i.test(hex)) return fallback
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
}

interface NeuralFieldProps {
  className?: string
  /** Hold the animation until the browser is idle (or this many ms have
   * passed) — for above-the-fold use, so it never competes with page load.
   * A still frame is drawn immediately either way. */
  startDelay?: number
}

export function NeuralField({ className, startDelay = 0 }: NeuralFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    // Pointer is tracked on the enclosing section: the canvas (and usually
    // its wrapper) are pointer-events-none decoration.
    const host = canvas?.closest("section") ?? canvas?.parentElement
    if (!canvas || !ctx || !host) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = 1
    let signal: [number, number, number] = [47, 91, 255]
    let dark = true
    let core: [number, number, number] = [232, 239, 255]
    let neurons: Neuron[] = []
    const arcs: Arc[] = []
    const pulses: Pulse[] = []
    let pointer: P | null = null

    const readColors = () => {
      const style = getComputedStyle(canvas)
      signal = parseHex(style.getPropertyValue("--signal"), signal)
      const [r, g, b] = parseHex(style.getPropertyValue("--paper"), [10, 10, 10])
      dark = 0.2126 * r + 0.7152 * g + 0.0722 * b < 128
      core = dark ? [232, 239, 255] : [24, 52, 196]
    }

    const seedNeurons = () => {
      const count = Math.min(MAX_NEURONS, Math.round(width * height * DENSITY))
      neurons = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
      }))
      arcs.length = 0
      pulses.length = 0
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      seedNeurons()
    }

    const linkDist = () => Math.min(220, Math.max(140, width * 0.12))

    /** Random pair of currently-linked neurons, or null. */
    const randomLink = (): [number, number] | null => {
      const d = linkDist()
      for (let tries = 0; tries < 20; tries++) {
        const a = Math.floor(Math.random() * neurons.length)
        const b = Math.floor(Math.random() * neurons.length)
        if (a === b) continue
        const dist = Math.hypot(neurons[a].x - neurons[b].x, neurons[a].y - neurons[b].y)
        if (dist < d && dist > 40) return [a, b]
      }
      return null
    }

    const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
    const glow = (): [number, number, number] =>
      dark ? [Math.min(255, signal[0] + 60), Math.min(255, signal[1] + 70), 255] : signal

    /** Jagged lightning polyline between two points. */
    const lightning = (a: P, b: P, seed: number, t: number): P[] => {
      const segs = 9
      const dx = b[0] - a[0]
      const dy = b[1] - a[1]
      const len = Math.hypot(dx, dy) || 1
      const nx = -dy / len
      const ny = dx / len
      const pts: P[] = [a]
      for (let i = 1; i < segs; i++) {
        const f = i / segs
        const env = Math.sin(f * Math.PI) // pinned at both ends
        const n =
          Math.sin(i * 2.7 + seed * 11 + t * 38) * 0.6 + Math.sin(i * 5.3 - seed * 7 + t * 23) * 0.4
        const off = n * env * Math.min(26, len * 0.18)
        pts.push([a[0] + dx * f + nx * off, a[1] + dy * f + ny * off])
      }
      pts.push(b)
      return pts
    }

    const draw = (time: number, dt: number) => {
      const t = time / 1000
      const g = glow()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over"

      // Move neurons (wrap softly at the edges).
      if (dt > 0) {
        for (const n of neurons) {
          n.x += n.vx * dt
          n.y += n.vy * dt
          if (n.x < -20) n.x = width + 20
          if (n.x > width + 20) n.x = -20
          if (n.y < -20) n.y = height + 20
          if (n.y > height + 20) n.y = -20
        }
      }

      // Links
      const d = linkDist()
      ctx.lineWidth = 0.7
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dist = Math.hypot(neurons[i].x - neurons[j].x, neurons[i].y - neurons[j].y)
          if (dist < d) {
            ctx.strokeStyle = rgba(signal, (1 - dist / d) * (dark ? 0.32 : 0.2))
            ctx.beginPath()
            ctx.moveTo(neurons[i].x, neurons[i].y)
            ctx.lineTo(neurons[j].x, neurons[j].y)
            ctx.stroke()
          }
        }
      }

      // Synapse arcs: short-lived lightning between linked neurons.
      if (dt > 0 && arcs.length < 5 && Math.random() < dt * 3.2) {
        const link = randomLink()
        if (link) arcs.push({ a: link[0], b: link[1], age: 0, life: 0.45 + Math.random() * 0.4, seed: Math.random() * 10 })
      }
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i]
        arc.age += dt
        if (arc.age > arc.life) {
          // A fired synapse sends a pulse onward along the same link.
          pulses.push({ a: arc.a, b: arc.b, t: 0, speed: 0.6 + Math.random() * 0.5 })
          arcs.splice(i, 1)
          continue
        }
        const fade = Math.sin((arc.age / arc.life) * Math.PI)
        const flicker = 0.7 + 0.3 * Math.sin(t * 60 + arc.seed * 9)
        const A = neurons[arc.a]
        const B = neurons[arc.b]
        if (!A || !B) continue
        const pts = lightning([A.x, A.y], [B.x, B.y], arc.seed, t)
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        for (const [color, alpha, w] of [
          [g, 0.08, 14],
          [g, 0.3, 5],
          [core, 0.95, 1.6],
        ] as [[number, number, number], number, number][]) {
          ctx.strokeStyle = rgba(color, alpha * fade * flicker)
          ctx.lineWidth = w
          ctx.beginPath()
          pts.forEach(([x, y], k) => (k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
          ctx.stroke()
        }
      }

      // Ambient pulses so the field is alive between synapse bursts.
      if (dt > 0 && pulses.length < 10 && Math.random() < dt * 1.5) {
        const link = randomLink()
        if (link) pulses.push({ a: link[0], b: link[1], t: 0, speed: 0.35 + Math.random() * 0.4 })
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.t += dt * p.speed
        const A = neurons[p.a]
        const B = neurons[p.b]
        if (p.t >= 1 || !A || !B) {
          pulses.splice(i, 1)
          continue
        }
        const x = A.x + (B.x - A.x) * p.t
        const y = A.y + (B.y - A.y) * p.t
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 10)
        halo.addColorStop(0, rgba(core, 0.9))
        halo.addColorStop(0.3, rgba(g, 0.5))
        halo.addColorStop(1, rgba(g, 0))
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill()
      }

      // Neurons — brighter near the pointer.
      for (const n of neurons) {
        let boost = 0
        if (pointer) {
          const dist = Math.hypot(n.x - pointer[0], n.y - pointer[1])
          boost = Math.max(0, 1 - dist / 220)
        }
        const r = 1.4 + boost * 2
        ctx.fillStyle = rgba(g, (dark ? 0.18 : 0.1) + boost * 0.3)
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = rgba(core, 0.55 + boost * 0.45)
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = "source-over"
    }

    let frame = 0
    let last = 0
    let running = false

    const tick = (now: number) => {
      // The first rAF timestamp can predate start()'s performance.now().
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000 || 0))
      last = now
      draw(now, dt)
      frame = requestAnimationFrame(tick)
    }
    // Gated by startDelay: until `ready`, only the still frame is shown.
    let ready = startDelay <= 0
    const start = () => {
      if (running || reducedMotion || !ready) return
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
    draw(0, 0)

    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (!running) draw(0, 0)
    })
    resizeObserver.observe(canvas)

    // Follow light/dark switches.
    const themeObserver = new MutationObserver(() => {
      readColors()
      if (!running) draw(0, 0)
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    let inView = false
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

    let idleHandle = 0
    let delayTimer = 0
    if (!ready) {
      const release = () => {
        if (ready) return
        ready = true
        if (inView && !document.hidden) start()
      }
      // Wait out the delay, then for the next idle moment (capped at 1s).
      delayTimer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          idleHandle = window.requestIdleCallback(release, { timeout: 1000 })
        } else {
          release()
        }
      }, startDelay)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer = [event.clientX - rect.left, event.clientY - rect.top]
    }
    const onPointerLeave = () => (pointer = null)
    host.addEventListener("pointermove", onPointerMove)
    host.addEventListener("pointerleave", onPointerLeave)

    return () => {
      stop()
      window.clearTimeout(delayTimer)
      if (idleHandle) window.cancelIdleCallback(idleHandle)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      visibility.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      host.removeEventListener("pointermove", onPointerMove)
      host.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [startDelay])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  )
}
