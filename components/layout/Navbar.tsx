"use client"

import { Logo } from "@/components/common/Logo"
import { SettingsDrawer } from "@/components/layout/SettingsDrawer"
import { navItems } from "@/lib/data/hero"
import { cn } from "@/lib/utils"
import { Gamepad2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState<string>("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.replace("/#", "")))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`/#${entry.target.id}`)
          }
        })
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
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
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-lg"
            : "border-b border-transparent bg-transparent"
        )}
        role="banner"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
          role="navigation"
          aria-label="Primary navigation"
        >
          <Logo />

          <ul
            className="hidden items-center gap-8 md:flex"
            role="menubar"
            aria-label="Main navigation menu"
          >
            {navItems.map((item) => {
              const isActive = activeHash === item.href
              return (
                <li key={item.name} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    className={cn(
                      "relative text-sm font-medium transition-colors hover:text-heading",
                      isActive ? "text-heading" : "text-label"
                    )}
                    data-cursor="magnetic"
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-brand" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:bg-muted"
            aria-label="Open settings"
            data-cursor="magnetic"
          >
            <Gamepad2 className="size-5" />
          </button>
        </nav>
      </header>

      <SettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}
