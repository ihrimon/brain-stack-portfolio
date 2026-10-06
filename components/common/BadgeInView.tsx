"use client"

import { useEffect } from "react"

/**
 * Runs the `.badge-border` orbit only while a badge is on screen. The orbit
 * animates a registered custom property, which costs a style recalc and a
 * repaint every frame — fine for the one or two badges in view, wasteful for
 * a dozen off-screen ones (and it used to land squarely in page-load work).
 * Badges are paused by default in CSS; this flags the visible ones with
 * `data-inview`. A MutationObserver picks up badges added by client
 * navigations. Renders nothing.
 */
export function BadgeInView() {
  useEffect(() => {
    const seen = new WeakSet<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.toggleAttribute("data-inview", entry.isIntersecting)
      }
    })

    const scan = () => {
      document.querySelectorAll(".badge-border").forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        io.observe(el)
      })
    }
    scan()

    let queued = false
    const mo = new MutationObserver(() => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        scan()
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
