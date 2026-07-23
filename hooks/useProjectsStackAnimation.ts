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
 * The row-stacking/overlap position itself is pure CSS — `position: sticky`
 * at `top: 0` plus increasing `z-index` (see ProjectsStack.tsx), not driven
 * from here. A previous version pinned each row with a ScrollTrigger
 * (`pin: true`) and scrubbed a separate scale/opacity tween on the row
 * underneath; that recipe needs the pin's scroll distance to match the
 * cover tween's duration *exactly*, and any mismatch showed up as the row
 * unpinning before or after the next one visually finished covering it — a
 * stuck pause, then a snap. Native sticky has nothing like that to keep in
 * sync: the browser's own compositor owns the position every frame.
 *
 * What GSAP still does here is purely cosmetic, layered on top of that
 * native position rather than driving it: as the next row approaches its
 * own sticky point, the row it's about to cover scrubs down to a slightly
 * smaller, dimmer state — reads as the old pair settling backward, not a
 * hard cut. Getting this scrub's timing wrong only makes the fade a touch
 * early or late; it can't reintroduce the old stuck/snap bug, because it
 * never touches position.
 *
 * Beyond that, this hook owns two things that genuinely need JS: which
 * card is "active" (closest to the viewport's vertical center — drives the
 * `data-active` attribute and video play/pause) via a single
 * IntersectionObserver instead of a per-frame ScrollTrigger `onUpdate`
 * loop, and the mobile fallback fade-up (CSS drops `sticky` below `sm:`,
 * so mobile gets a plain list and needs its own reveal instead).
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

          // Desktop/tablet: sticky (ProjectsStack.tsx) already handles the
          // actual stacking position. This just settles the outgoing row
          // back a little as the incoming one arrives — skipped under
          // reduced motion since it's a cosmetic scrub, not the layout.
          if (conditions.reduce) return

          const rows = rowRefs.current.filter(
            (el): el is HTMLDivElement => el !== null
          )

          for (let i = 0; i < rows.length - 1; i++) {
            gsap.to(rows[i], {
              scale: 0.96,
              opacity: 0.85,
              ease: "none",
              scrollTrigger: {
                trigger: rows[i + 1],
                start: "top bottom",
                end: "top top",
                scrub: true,
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
