"use client"

import type { ProjectCardHandle } from "@/components/projects/ProjectCard"
import {
  MOBILE_BREAKPOINT_PX,
  TABLET_BREAKPOINT_PX,
} from "@/components/three/hero-background/constants"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import type { RefObject } from "react"

gsap.registerPlugin(ScrollTrigger)

interface UseProjectsStackAnimationArgs {
  containerRef: RefObject<HTMLDivElement | null>
  rowRefs: RefObject<Array<HTMLDivElement | null>>
  cardHandles: RefObject<Array<ProjectCardHandle | null>>
  itemCount: number
}

/**
 * All scroll-driven behavior for the stacked project gallery, kept entirely
 * out of the UI components: row pinning + overlap (desktop/tablet), the
 * "closest to viewport center" active-card tracker that drives both the
 * `data-active` attribute and video play/pause, and the mobile fallback.
 *
 * Stacking technique: rows 0..N-2 each pin (`pin: true, pinSpacing: false`)
 * for one viewport-height of scroll — `pinSpacing: false` is what lets the
 * next row's normal-flow position immediately rise to cover the pinned row,
 * with no gap. The last row is never pinned since nothing needs to cover
 * it. A separate scrubbed tween per adjacent pair scales/fades the
 * outgoing row as the next row's top crosses the viewport. z-index is set
 * once per row (increasing with row index) rather than animated — later
 * rows always belong on top, so there's nothing to toggle mid-scroll.
 */
export function useProjectsStackAnimation({
  containerRef,
  rowRefs,
  cardHandles,
  itemCount,
}: UseProjectsStackAnimationArgs) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: `(min-width: ${TABLET_BREAKPOINT_PX + 1}px)`,
          isTablet: `(min-width: ${MOBILE_BREAKPOINT_PX + 1}px) and (max-width: ${TABLET_BREAKPOINT_PX}px)`,
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions ?? {}
          const isStacked =
            (conditions.isDesktop || conditions.isTablet) && !conditions.reduce

          const cardRoots = cardHandles.current
            .map((handle) => handle?.root)
            .filter((el): el is HTMLDivElement => Boolean(el))

          if (!isStacked) {
            // Mobile, or any breakpoint under prefers-reduced-motion: plain
            // vertical list — no pin, no overlap, just a fade-up per card.
            // (Any row pin/tween from a previously-matched breakpoint is
            // already torn down by gsap.matchMedia()'s own revert before
            // this branch ever runs.)
            gsap.effects.fadeUpOnScroll(cardRoots, {
              yOffset: 32,
              start: "top 88%",
            })
            return
          }

          const rows = rowRefs.current.filter(
            (el): el is HTMLDivElement => el !== null
          )
          if (rows.length === 0) return

          rows.forEach((row, i) => {
            gsap.set(row, { zIndex: i + 1 })

            if (i < rows.length - 1) {
              ScrollTrigger.create({
                trigger: row,
                start: "top top",
                // Must match the cover tween's duration below exactly (one
                // viewport height, via "top bottom" -> "top top" on the
                // *next* row) — a plain "+=100%" resolves against this
                // row's own rendered height instead, which almost never
                // equals the viewport height. That mismatch is what caused
                // the pin to release before/after the next row actually
                // finished covering it: a stuck pause, then a visible snap.
                end: () => `+=${window.innerHeight}`,
                pin: true,
                pinSpacing: false,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              })
            }

            if (i > 0) {
              gsap.to(rows[i - 1], {
                scale: 0.92,
                opacity: 0.6,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  end: "top top",
                  scrub: true,
                },
              })
            }
          })

          // Active-card tracking: whichever card sits closest to the
          // viewport's vertical center is "active" — drives the
          // `data-active` attribute (styled declaratively in ProjectCard)
          // and video play/pause, imperatively, with no React re-render on
          // scroll. `activeIndex` is a plain closure variable, not state.
          let activeIndex = -1

          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            onUpdate: () => {
              const handles = cardHandles.current
              const viewportCenter = window.innerHeight / 2
              let nearestIndex = -1
              let nearestDistance = Infinity

              handles.forEach((handle, index) => {
                const root = handle?.root
                if (!root) return
                const rect = root.getBoundingClientRect()
                if (rect.bottom < 0 || rect.top > window.innerHeight) return

                const distance = Math.abs(
                  rect.top + rect.height / 2 - viewportCenter
                )
                if (distance < nearestDistance) {
                  nearestDistance = distance
                  nearestIndex = index
                }
              })

              if (nearestIndex === activeIndex) return

              const prev = activeIndex >= 0 ? handles[activeIndex] : null
              prev?.root?.setAttribute("data-active", "false")
              prev?.pause()

              const next = nearestIndex >= 0 ? handles[nearestIndex] : null
              next?.root?.setAttribute("data-active", "true")
              next?.play()

              activeIndex = nearestIndex
            },
          })
        }
      )

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [itemCount] }
  )
}
