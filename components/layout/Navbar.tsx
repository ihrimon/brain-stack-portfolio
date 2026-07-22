"use client"

import { Logo } from "@/components/common/Logo"
import { SettingsDrawer } from "@/components/layout/SettingsDrawer"
import { primaryNavigationData } from "@/lib/constants/navigation"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

gsap.registerPlugin(ScrollTrigger)

export function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Toggled once the visitor scrolls past the Hero's own viewport-height
  // area, so the logo gets a solid backing and stays legible over whatever
  // (lighter or busier) content scrolls under the fixed header next.
  const [scrolledPastHero, setScrolledPastHero] = useState(false)

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      start: () => window.innerHeight,
      onEnter: () => setScrolledPastHero(true),
      onLeaveBack: () => setScrolledPastHero(false),
    })

    return () => trigger.kill()
  })

  return (
    <>
      <a
        href="#main-content"
        className="sr-only! focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-40 w-full bg-transparent"
        role="banner"
      >
        <nav
          className="mx-auto flex w-full max-w-400 items-center justify-between px-5 py-4 sm:px-8"
          role="navigation"
          aria-label="Primary navigation"
        >
          <div
            className={cn(
              "rounded-full px-4 py-2 transition-colors duration-300",
              scrolledPastHero ? "bg-black" : "bg-transparent"
            )}
          >
            <Logo variant="on-dark" className="text-white" />
          </div>

          <div className="flex items-center gap-3">
            <ul
              className={cn(
                "hidden h-14 items-center gap-1 rounded-full bg-transparent px-4 py-2 transition-all duration-500 ease-out lg:flex dark:border-white/15",
                scrolledPastHero
                  ? "pointer-events-none origin-right scale-50 opacity-0"
                  : "origin-right scale-100 opacity-100"
              )}
              role="menubar"
              aria-label="Main navigation menu"
              aria-hidden={scrolledPastHero}
            >
              {primaryNavigationData.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <li key={item.name} role="none">
                    <Link
                      href={item.href}
                      role="menuitem"
                      className={cn(
                        "group block rounded-full px-3 py-2 font-semibold text-lg transition-colors duration-300",
                        isActive
                          ? "bg-background text-foreground"
                          : "text-white/80 hover:bg-background hover:text-foreground"
                      )}
                      data-cursor="magnetic"
                    >
                      <span className="relative inline-flex overflow-hidden">
                        <span className="block transition-transform duration-300 ease-out group-hover:translate-y-full">
                          {item.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 block -translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                        >
                          {item.name}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "group flex size-14 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 p-2 rounded-full transition-colors duration-300",
                scrolledPastHero
                  ? "border border-white/15 bg-neutral-900/90 backdrop-blur dark:bg-white/5 hover:dark:bg-white/10"
                  : "bg-transparent"
              )}
              aria-label="Open menu"
              data-cursor="magnetic"
            >
              <span className="h-0.5 w-9 bg-white transition-all duration-300 group-hover:w-5 group-hover:translate-x-0.5" />
              <span className="h-0.5 w-9 bg-white transition-all duration-300 group-hover:w-5 group-hover:-translate-x-0.5" />
              <span className="h-0.5 w-9 bg-white transition-all duration-300 group-hover:w-5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </nav>
      </header>

      <SettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}
