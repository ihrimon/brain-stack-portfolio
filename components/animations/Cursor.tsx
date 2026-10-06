"use client"

import gsap from "gsap"
import { ArrowUpRight } from "lucide-react"
import { useEffect, useRef } from "react"

/**
 * Decorative dot+ring that follows the pointer alongside the normal OS
 * cursor (not a replacement for it). Hover targets opt in with
 * `data-cursor="magnetic" | "view" | "text"` and an optional
 * `data-cursor-text="Label"`.
 *
 * `view` is the Cuberto-style media cursor: the ring and dot step aside and
 * a signal-colored disc with an arrow grows in under the pointer. The disc
 * blends with `multiply`, so the media underneath shows through it tinted
 * (it's its own top-level fixed layer: blending only reaches the page from
 * outside the cursor root's stacking context); the arrow sits on a separate
 * layer above it so it stays crisp white. Hidden on coarse pointers /
 * reduced motion via the `cursor-root` CSS rules in globals.css — kept out
 * of React state so mount doesn't trigger a synchronous re-render.
 */
/** Share of the pointer offset a magnetic element follows. */
const MAGNET_STRENGTH = 0.25
/** Hard cap on the pull (px), so wide buttons don't drift too far. */
const MAGNET_MAX_OFFSET = 14
/** Targets bigger than this (either side, px) don't move. */
const MAGNET_MAX_SIZE = 320

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const pillIconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!isFinePointer || prefersReducedMotion) return

    const dot = dotRef.current
    const ring = ringRef.current
    const disc = pillRef.current
    const icon = pillIconRef.current
    if (!dot || !ring || !disc || !icon) return
    const pill = [disc, icon]

    gsap.set(pill, { scale: 0 })

    const moveDot = gsap.quickTo(dot, "x", {
      duration: 0.1,
      ease: "power3.out",
    })
    const moveDotY = gsap.quickTo(dot, "y", {
      duration: 0.1,
      ease: "power3.out",
    })
    const moveRing = gsap.quickTo(ring, "x", {
      duration: 0.35,
      ease: "power3.out",
    })
    const moveRingY = gsap.quickTo(ring, "y", {
      duration: 0.35,
      ease: "power3.out",
    })
    const movePillX = [disc, icon].map((el) =>
      gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" })
    )
    const movePillY = [disc, icon].map((el) =>
      gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" })
    )

    // Magnetic pull: a hovered `data-cursor="magnetic"` element drifts a
    // fraction of the way toward the pointer and settles back on leave.
    // Measured once on enter (not per move) so its own motion never feeds
    // back into the math; large targets (e.g. full-width FAQ rows) only get
    // the cursor ring, since dragging a whole row around would feel wrong.
    let magnet: {
      el: HTMLElement
      rect: DOMRect
      x: (value: number) => void
      y: (value: number) => void
    } | null = null

    const releaseMagnet = () => {
      if (!magnet) return
      gsap.to(magnet.el, { x: 0, y: 0, duration: 0.7, ease: "expo.out" })
      magnet = null
    }

    const onMouseMove = (e: MouseEvent) => {
      moveDot(e.clientX)
      moveDotY(e.clientY)
      moveRing(e.clientX)
      moveRingY(e.clientY)
      movePillX.forEach((move) => move(e.clientX))
      movePillY.forEach((move) => move(e.clientY))

      if (magnet) {
        const { rect } = magnet
        const pull = (offset: number) =>
          Math.max(
            -MAGNET_MAX_OFFSET,
            Math.min(MAGNET_MAX_OFFSET, offset * MAGNET_STRENGTH)
          )
        magnet.x(pull(e.clientX - (rect.left + rect.width / 2)))
        magnet.y(pull(e.clientY - (rect.top + rect.height / 2)))
      }
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]"
      )
      if (!target) return

      const variant = target.dataset.cursor
      const text = target.dataset.cursorText ?? ""

      if (variant === "view") {
        if (labelRef.current) labelRef.current.textContent = ""
        gsap.to(pill, { scale: 1, duration: 0.5, ease: "expo.out" })
        gsap.to([ring, dot], { scale: 0, duration: 0.3, ease: "power3.out" })
        return
      }

      if (variant === "magnetic" && target !== magnet?.el) {
        releaseMagnet()
        const rect = target.getBoundingClientRect()
        if (rect.width <= MAGNET_MAX_SIZE && rect.height <= MAGNET_MAX_SIZE) {
          magnet = {
            el: target,
            rect,
            x: gsap.quickTo(target, "x", { duration: 0.5, ease: "power3.out" }),
            y: gsap.quickTo(target, "y", { duration: 0.5, ease: "power3.out" }),
          }
        }
      }

      if (labelRef.current) labelRef.current.textContent = text
      gsap.to(ring, {
        scale: variant === "text" ? 3 : 1.6,
        duration: 0.3,
        ease: "power3.out",
      })
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]"
      )
      if (!target) return
      // Moving between children of the same target isn't leaving it.
      const next = (e.relatedTarget as HTMLElement | null)?.closest(
        "[data-cursor]"
      )
      if (next === target) return

      if (magnet?.el === target) releaseMagnet()
      if (labelRef.current) labelRef.current.textContent = ""
      gsap.to(pill, { scale: 0, duration: 0.3, ease: "power3.out" })
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3.out" })
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    window.addEventListener("mousemove", onMouseMove)
    // The magnet's rect is in viewport coordinates — stale once the page scrolls.
    window.addEventListener("scroll", releaseMagnet, { passive: true })
    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseout", onMouseOut)

    return () => {
      releaseMagnet()
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", releaseMagnet)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseout", onMouseOut)
    }
  }, [])

  return (
    <>
      <div
        className="cursor-root pointer-events-none fixed inset-0 z-100"
        aria-hidden="true"
      >
        <div
          ref={dotRef}
          className="fixed top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary"
        />
        <div
          ref={ringRef}
          className="fixed top-0 left-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-primary/50"
        >
          <span
            ref={labelRef}
            className="text-[10px] font-medium tracking-wide text-heading uppercase"
          />
        </div>
      </div>

      {/* `view` disc: multiply-blended signal color (a filter over the media). */}
      <div
        ref={pillRef}
        aria-hidden="true"
        className="cursor-root pointer-events-none fixed top-0 left-0 z-100 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal mix-blend-multiply"
      />
      <div
        ref={pillIconRef}
        aria-hidden="true"
        className="cursor-root pointer-events-none fixed top-0 left-0 z-100 size-24 -translate-x-1/2 -translate-y-1/2 text-white"
      >
        {/* Inner flex box: `.cursor-root` forces display: block on the layer. */}
        <div className="flex size-full items-center justify-center">
          <ArrowUpRight className="size-8" strokeWidth={1.5} />
        </div>
      </div>
    </>
  )
}
