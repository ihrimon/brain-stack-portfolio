"use client"

import { mobileNavigationData } from "@/lib/constants/navigation"
import { cn } from "@/lib/utils/cn"
import {
  Briefcase,
  Home,
  Layers,
  Mail,
  Newspaper,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ICONS: Record<string, LucideIcon> = {
  Home,
  Projects: Briefcase,
  Services: Layers,
  Blog: Newspaper,
  Contact: Mail,
}

type NavItem = (typeof mobileNavigationData)[number]

// "Home" is pulled out of the row and rendered as the floating center
// button (see reference image) — everything else splits evenly to either
// side of it, same as before.
const centerItem = mobileNavigationData.find((item) => item.href === "/")
const sideItems = mobileNavigationData.filter((item) => item.href !== "/")
const splitIndex = Math.ceil(sideItems.length / 2)
const leftItems = sideItems.slice(0, splitIndex)
const rightItems = sideItems.slice(splitIndex)

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const renderItem = (item: NavItem) => {
    const Icon = ICONS[item.name] ?? Home
    const active = isActive(item.href)

    return (
      <Link
        key={item.name}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium tracking-wide uppercase"
      >
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-full transition-all duration-300",
            active &&
              "-translate-y-6 bg-neutral-900 ring-1 ring-accent ring-offset-1 ring-offset-transparent"
          )}
        >
          <Icon
            className={cn(
              "size-6 transition-all duration-300",
              active ? "scale-110 text-accent" : "text-white/50"
            )}
          />
        </span>
        <span
          className={cn(
            "transition-colors duration-300",
            active ? "hidden" : "text-white/50"
          )}
        >
          {item.name}
        </span>
      </Link>
    )
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-white/10 bg-neutral-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="relative flex items-stretch">
        {leftItems.map(renderItem)}

        {/* Reserves room under the floating center button so the side
            items don't crowd underneath it. */}
        {centerItem && <div className="w-16 shrink-0" aria-hidden="true" />}

        {rightItems.map(renderItem)}

        {centerItem &&
          (() => {
            const Icon = ICONS[centerItem.name] ?? Home
            const active = isActive(centerItem.href)

            return (
              <Link
                href={centerItem.href}
                aria-current={active ? "page" : undefined}
                aria-label={centerItem.name}
                className={cn(
                  "absolute left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full",
                  "bg-neutral-900 transition-all duration-300 active:scale-95",
                  active
                    ? "-top-7 ring-1 ring-accent ring-offset-2 ring-offset-transparent"
                    : ""
                )}
              >
                <Icon
                  className={cn(
                    "size-6 transition-colors duration-300",
                    active ? "text-accent" : "text-white"
                  )}
                />
              </Link>
            )
          })()}
      </div>
    </nav>
  )
}
