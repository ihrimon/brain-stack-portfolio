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
  rowRefs: RefObject<Array<HTMLDivElement | null>>
  cardHandles: RefObject<Array<ProjectCardHandle | null>>
  itemCount: number
}

/**
 * Desktop/tablet (`sm:` and up): every row but the last is pinned via
 * ScrollTrigger for a scroll distance equal to its own height, with
 * `pinSpacing: false` so no extra space is reserved after it — the next
 * row's natural document position is therefore only its own height away.
 * Combined with the small negative top margin in ProjectsStack.tsx, the
 * next row (later in DOM, higher z-index) arrives a little *before* the
 * current row's pin ends: both are momentarily trying to occupy the same
 * spot, the later one wins by z-index, and it reads as sliding up to cover
 * the current row rather than an abrupt handoff.
 *
 * The settle-back scale/opacity animation lives on the *same* ScrollTrigger
 * as the pin — one `gsap.to` call doing both — rather than a second
 * trigger keyed off the next row's arrival. A previous version used two
 * separate triggers that had to agree on timing by coincidence (the pin's
 * scroll distance vs. the cover tween's duration); any mismatch showed up
 * as a stuck pause or a snap. A single trigger can't drift out of sync with
 * itself.
 *
 * Beyond that, this hook owns two things that genuinely need JS: which
 * card is "active" (closest to the viewport's vertical center — drives the
 * `data-active` attribute and video play/pause) via a single
 * IntersectionObserver instead of a per-frame ScrollTrigger `onUpdate`
 * loop, and the mobile fallback fade-up (mobile skips the pin entirely and
 * gets a plain list with its own reveal instead).
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

          // Desktop/tablet: skip pinning entirely under reduced motion —
          // rows just render in their static (slightly overlapping-margin)
          // layout with no scroll-driven cover effect.
          if (conditions.reduce) return

          const rows = rowRefs.current.filter(
            (el): el is HTMLDivElement => el !== null
          )

          for (let i = 0; i < rows.length - 1; i++) {
            const row = rows[i]

            gsap.to(row, {
              scale: 0.94,
              opacity: 0.75,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top top",
                end: () => `+=${row.offsetHeight}`,
                pin: true,
                pinSpacing: false,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
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
