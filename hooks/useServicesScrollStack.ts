"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import type { RefObject } from "react"

gsap.registerPlugin(ScrollTrigger)

// Matches the `lg:` breakpoint ServicesStack.tsx itself switches the two
// layouts on — the pinned split layout only makes sense once that's live.
const DESKTOP_BREAKPOINT_PX = 1024

// Scroll distance dedicated to each service before the next one takes over
// the image column. Deliberately short: with the content pinned and only
// the image column moving, there's no reason for this to cost a whole
// viewport's worth of scroll per item.
const SCROLL_PER_ITEM_PX = 480

interface UseServicesScrollStackArgs {
  containerRef: RefObject<HTMLDivElement | null>
  pinRef: RefObject<HTMLDivElement | null>
  windowRef: RefObject<HTMLDivElement | null>
  trackRef: RefObject<HTMLDivElement | null>
  mobileListRef: RefObject<HTMLDivElement | null>
  itemCount: number
  onIndexChange: (index: number) => void
}

/**
 * Desktop (`lg`+, motion-safe — see the `lg:motion-safe:` classes in
 * ServicesStack.tsx): `pinRef` is pinned for one continuous scroll spanning
 * every service. Because the *entire* pinned box — content column included
 * — is fixed on screen for that whole scroll, the text never itself moves;
 * only `trackRef` (a flex column of image pairs, one per service, each
 * exactly `windowRef`'s height) is transformed, scrubbed 1:1 with scroll
 * progress. `onIndexChange` swaps which service's text is rendered to match
 * whichever image pair is currently framed in `windowRef`.
 *
 * Below `lg`, or with reduced motion at any width, CSS shows the plain
 * stacked list (`mobileListRef`) instead — this hook just gives that list a
 * fade-up reveal per row, no pin/scrub involved.
 */
export function useServicesScrollStack({
  containerRef,
  pinRef,
  windowRef,
  trackRef,
  mobileListRef,
  itemCount,
  onIndexChange,
}: UseServicesScrollStackArgs) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: `(min-width: ${DESKTOP_BREAKPOINT_PX}px)`,
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions ?? {}
          // Mirrors the `lg:motion-safe:hidden` / `hidden lg:motion-safe:block`
          // split in ServicesStack.tsx: the plain list is what's actually on
          // screen any time we're not both desktop-wide *and* motion-safe.
          const listVisible = !conditions.isDesktop || conditions.reduce

          if (listVisible) {
            const rows = mobileListRef.current
              ? Array.from(mobileListRef.current.children)
              : []

            if (conditions.reduce) {
              gsap.set(rows, { autoAlpha: 1, y: 0 })
              return
            }

            gsap.effects.fadeUpOnScroll(rows, {
              yOffset: 32,
              start: "top 88%",
            })
            return
          }

          const pin = pinRef.current
          const track = trackRef.current
          const win = windowRef.current
          if (!pin || !track || !win || itemCount < 2) return

          const distance = SCROLL_PER_ITEM_PX * (itemCount - 1)

          const trigger = ScrollTrigger.create({
            trigger: pin,
            start: "top top",
            end: `+=${distance}`,
            pin: true,
            // Pre-applies the pin's positioning a touch before the trigger
            // point instead of snapping to it exactly on "top top" — without
            // this, engaging and releasing the pin each read as a sudden
            // jump (the section abruptly leaping into place, then dropping
            // back into normal flow the instant the scroll ends).
            anticipatePin: 1,
            scrub: 1,
            onUpdate: (self) => {
              const slideHeight = win.clientHeight
              gsap.set(track, {
                y: -self.progress * (itemCount - 1) * slideHeight,
              })
              onIndexChange(Math.round(self.progress * (itemCount - 1)))
            },
          })

          return () => trigger.kill()
        }
      )

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [itemCount] }
  )
}
