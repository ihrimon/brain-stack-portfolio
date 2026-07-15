"use client"

import { Logo } from "@/components/common/Logo"
import { SettingsDrawer } from "@/components/layout/SettingsDrawer"
import { navigationData } from "@/lib/constants/navigation"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

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
          <Logo variant="on-dark" className="text-white" />

          <ul
            className="hidden h-14 items-center gap-1 rounded-full border border-white/10 bg-neutral-900/90 px-2 py-2 backdrop-blur-sm lg:flex dark:border-white/15 dark:bg-white/5"
            role="menubar"
            aria-label="Main navigation menu"
          >
            {navigationData.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <li key={item.name} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    className={cn(
                      "block rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-white underline underline-offset-4"
                        : "text-white/80 hover:text-white"
                    )}
                    data-cursor="magnetic"
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="group flex size-14 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.25 rounded-full border border-white/15 bg-neutral-900/90 backdrop-blur transition-colors dark:bg-white/5 hover:dark:bg-white/10"
            aria-label="Open menu"
            data-cursor="magnetic"
          >
            <span className="h-px w-7 bg-white transition-all duration-300 group-hover:w-3.5 group-hover:translate-x-0.5" />
            <span className="h-px w-7 bg-white transition-all duration-300 group-hover:w-5 group-hover:-translate-x-0.5" />
            <span className="h-px w-7 bg-white transition-all duration-300 group-hover:w-2.5 group-hover:translate-x-1" />
          </button>
        </nav>
      </header>

      <SettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}
