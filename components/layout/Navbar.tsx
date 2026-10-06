"use client"

import { Logo } from "@/components/common/Logo"
import { cn } from "@/lib/utils/cn"
import { ArrowUpRight } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// The menu drawer (and vaul behind it) is only needed once someone opens
// the menu, so it stays out of every page's initial bundle and loads on
// first open instead.
const SettingsDrawer = dynamic(
  () => import("@/components/layout/SettingsDrawer").then((mod) => mod.SettingsDrawer),
  { ssr: false }
)

/** Scroll distance before the bar gets its blurred backing. */
const SOLID_AFTER_PX = 24
/** Don't hide the bar until the visitor is clearly past the top. */
const HIDE_AFTER_PX = 320
/** Movement needed before the scroll direction counts as changed. Lenis
 * eases out with sub-pixel steps (and repeated identical positions), which
 * would otherwise flip hide/show every frame at the end of a gesture. */
const DIRECTION_THRESHOLD_PX = 8

export function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Mount the drawer on first open, then keep it mounted so its close
  // animation can play.
  const [drawerMounted, setDrawerMounted] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  // Hide on scroll down, reveal on scroll up (x.ai / Cuberto pattern). One
  // passive listener, throttled to a frame; Lenis drives the native window
  // scroll, so plain `scroll` events fire as usual.
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        setSolid(y > SOLID_AFTER_PX)
        if (y <= HIDE_AFTER_PX) {
          setHidden(false)
          lastY.current = y
          return
        }
        const delta = y - lastY.current
        // Only act on real movement; below the threshold keep the current
        // state and keep accumulating from the last decisive position.
        if (Math.abs(delta) < DIRECTION_THRESHOLD_PX) return
        setHidden(delta > 0)
        lastY.current = y
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only! focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className={cn(
          "fixed inset-x-0 top-0 z-40 w-full border-b transition-[transform,background-color,border-color] duration-500 ease-premium",
          solid
            ? "border-line bg-paper/75 backdrop-blur-xl"
            : "border-transparent bg-transparent",
          hidden && !drawerOpen && "-translate-y-full"
        )}
      >
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex h-18 w-full max-w-site items-center justify-between gap-6 px-4 lg:px-6"
        >
          <Logo className="shrink-0 whitespace-nowrap text-ink" />

          {/* No inline link list — the full menu lives in the drawer. The only
              always-visible action is the "Start A Project" CTA. */}
          <div className="flex items-center gap-2">
            <StartProjectButton active={pathname.startsWith("/contact")} />

            <button
              type="button"
              onClick={() => {
                setDrawerMounted(true)
                setDrawerOpen(true)
              }}
              onPointerEnter={() => {
                // Warm the chunk on hover so the first open feels instant.
                void import("@/components/layout/SettingsDrawer")
              }}
              aria-label="Open menu"
              className="group flex size-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border border-line transition-colors duration-300 hover:border-ink"
            >
              <span className="h-px w-4.5 bg-ink transition-transform duration-500 ease-premium group-hover:translate-y-[3.5px]" />
              <span className="h-px w-4.5 bg-ink transition-transform duration-500 ease-premium group-hover:-translate-y-[3.5px]" />
            </button>
          </div>
        </nav>
      </header>

      {drawerMounted && (
        <SettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      )}
    </>
  )
}

/** The bar's single always-visible CTA. Styled like the section badges: a
 * hairline capsule with a signal light orbiting its border (`.badge-border`
 * in globals.css). On hover the signal color floods in from the left (same
 * gesture as PrimaryButton), the label rolls to a second copy and the arrow
 * turns. */
function StartProjectButton({ active }: { active: boolean }) {
  return (
    <Link
      href="/contact"
      aria-current={active ? "page" : undefined}
      className={cn(
        "badge-border group relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors duration-500 sm:h-11 sm:pr-4 sm:pl-5 sm:text-sm",
        active ? "bg-signal text-signal-ink" : "bg-ink/[0.03] text-ink"
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 rounded-full bg-signal transition-transform duration-500 ease-premium group-hover:scale-x-100"
      />

      <span className="relative inline-flex overflow-hidden whitespace-nowrap">
        <span className="block transition-transform duration-500 ease-premium group-hover:-translate-y-full">
          Start A Project
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full text-signal-ink transition-transform duration-500 ease-premium group-hover:translate-y-0"
        >
          Start A Project
        </span>
      </span>

      <ArrowUpRight
        aria-hidden="true"
        className="relative hidden size-4 transition-[transform,color] duration-500 ease-premium group-hover:rotate-45 group-hover:text-signal-ink sm:block"
      />
    </Link>
  )
}
