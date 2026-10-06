"use client"

import { mobileNavigationData } from "@/lib/constants/navigation"
import { cn } from "@/lib/utils/cn"
import {
  Briefcase,
  Home,
  Layers,
  Mail,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ICONS: Record<string, LucideIcon> = {
  Home,
  Projects: Briefcase,
  Services: Layers,
  Blog: Newspaper,
  About: Users,
  Contact: Mail,
}

type NavItem = (typeof mobileNavigationData)[number]

// Home sits in the middle of the row, everything else splits evenly to
// either side of it.
const centerItem = mobileNavigationData.find((item) => item.href === "/")
const sideItems = mobileNavigationData.filter((item) => item.href !== "/")
const splitIndex = Math.ceil(sideItems.length / 2)
const orderedItems: NavItem[] = [
  ...sideItems.slice(0, splitIndex),
  ...(centerItem ? [centerItem] : []),
  ...sideItems.slice(splitIndex),
]

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-white/10 bg-surface-dark/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch">
        {orderedItems.map((item) => {
          const Icon = ICONS[item.name] ?? Home
          const active = isActive(item.href)

          // Every item, active or not, stays in place: icon on top, label
          // below. The active one gets a soft accent pill behind its icon
          // and accent-colored icon and label.
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium tracking-wide uppercase"
            >
              <span
                className={cn(
                  "flex h-8 w-12 items-center justify-center rounded-full transition-colors duration-300",
                  active ? "bg-accent/15" : "bg-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "size-5.5 transition-colors duration-300",
                    active ? "text-accent" : "text-white/50"
                  )}
                />
              </span>
              <span
                className={cn(
                  "transition-colors duration-300",
                  active ? "text-accent" : "text-white/50"
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
