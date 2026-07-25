"use client"

import type { ProjectCardHandle } from "@/components/projects/ProjectCard"
import { MOBILE_BREAKPOINT_PX } from "@/components/three/hero-background/constants"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import type { RefObject } from "react"
import { useEffect } from "react"

gsap.registerPlugin(ScrollTrigger)

interface UseProjectsStackAnimationArgs {
  containerRef: RefObject<HTMLDivElement | null>
  stageRefs: RefObject<Array<HTMLDivElement | null>>
  rowRefs: RefObject<Array<HTMLDivElement | null>>
  overlayRefs: RefObject<Array<HTMLDivElement | null>>
  glowRefs: RefObject<Array<HTMLDivElement | null>>
  cardHandles: RefObject<Array<ProjectCardHandle | null>>
  itemCount: number
}

/**
 * Desktop/tablet (`sm:` and up): the stacking itself is plain CSS —
 * `position: sticky` on each row in ProjectsStack.tsx. A stuck row is later
 * in DOM (and given an ascending z-index) than the ones before it, so as the
 * next row's stage scrolls up through the viewport it naturally rises over
 * and covers the previous — that's ordinary scroll + sticky + z-index, no
 * translate, no JS-driven position. This hook only adds the *polish* on top:
 * a scrub-linked crossfade of two purely-opacity layers (a darken scrim on
 * the row being covered, a glow/shadow frame on the row doing the covering),
 * timed to exactly the window where the next row is rising into view —
 * `trigger: stage[i]` (the row's own flow container, including its dwell
 * spacer), `start: "bottom bottom"` (next row's leading edge just entering
 * the viewport) to `end: "bottom top"` (next row fully locked at the top,
 * i.e. fully covering). Opacity-only tweens keep this cheap: no layout
 * reads/writes on scroll, nothing fights the sticky positioning.
 *
 * Beyond that, this hook owns two things that genuinely need JS: which card
 * is "active" (closest to the viewport's vertical center — drives the
 * `data-active` attribute and video play/pause) via a single
 * IntersectionObserver instead of a per-frame polling loop, and the mobile
 * fallback fade-up (mobile skips the sticky stack entirely and gets a plain
 * list with its own reveal instead).
 */
export function useProjectsStackAnimation({
  containerRef,
  stageRefs,
  rowRefs,
  overlayRefs,
  glowRefs,
  cardHandles,
  itemCount,
}: UseProjectsStackAnimationArgs) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isMobile: `(max-width: ${MOBILE_BREAKPOINT_PX}px)`,
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions ?? {}

          if (conditions.isMobile) {
            const cardRoots = cardHandles.current
              .map((handle) => handle?.root)
              .filter((el): el is HTMLDivElement => Boolean(el))

            if (conditions.reduce) {
              gsap.set(cardRoots, { autoAlpha: 1, y: 0 })
              return
            }

            gsap.effects.fadeUpOnScroll(cardRoots, {
              yOffset: 32,
              start: "top 88%",
            })
            return
          }

          const rows = rowRefs.current.filter(
            (el): el is HTMLDivElement => el !== null
          )

          // Reduced motion: the sticky positioning is itself a scroll-driven
          // visual change, so opt all rows back out of it and let them sit
          // in plain, static document flow — no pin, no scrub, no crossfade.
          if (conditions.reduce) {
            gsap.set(rows, { position: "static" })
            return
          }

          const stages = stageRefs.current

          for (let i = 0; i < stages.length - 1; i++) {
            const stage = stages[i]
            const overlay = overlayRefs.current[i]
            const glow = glowRefs.current[i + 1]
            if (!stage || !overlay || !glow) continue

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: stage,
                  start: "bottom bottom",
                  end: "bottom top",
                  scrub: 0.4,
                  invalidateOnRefresh: true,
                },
              })
              .to(overlay, { opacity: 0.14, ease: "none" }, 0)
              .to(glow, { opacity: 1, ease: "none" }, 0)
          }
        }
      )

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [itemCount] }
  )

  useEffect(() => {
    const handles = cardHandles.current
    const roots = handles
      .map((handle) => handle?.root)
      .filter((el): el is HTMLDivElement => Boolean(el))

    if (roots.length === 0) return

    // A thin band at the viewport's vertical center: whichever card is
    // crossing it counts as "active." Cheap by construction — the browser
    // only calls back on actual threshold crossings, not on every scroll
    // tick the way the getBoundingClientRect-per-card polling loop this
    // replaced did.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const root = entry.target
          const handle = handles.find((h) => h?.root === root)
          if (!handle) continue

          if (entry.isIntersecting) {
            handle.root?.setAttribute("data-active", "true")
            handle.play()
          } else {
            handle.root?.setAttribute("data-active", "false")
            handle.pause()
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )

    roots.forEach((root) => observer.observe(root))

    return () => observer.disconnect()
  }, [cardHandles, itemCount])
}
