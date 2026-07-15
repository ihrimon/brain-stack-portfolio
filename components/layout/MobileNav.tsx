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

const ITEM_COUNT = mobileNavigationData.length

export function MobileNav() {
  const pathname = usePathname()
  const activeIndex = mobileNavigationData.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  )

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="relative flex items-stretch">
        {activeIndex !== -1 && (
          <span
            aria-hidden="true"
            className="absolute inset-y-1.5 rounded-2xl transition-[left] duration-300 ease-out"
            style={{
              left: `${(activeIndex * 100) / ITEM_COUNT}%`,
              width: `${100 / ITEM_COUNT}%`,
            }}
          />
        )}

        {mobileNavigationData.map((item, index) => {
          const Icon = ICONS[item.name] ?? Home
          const isActive = index === activeIndex

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium tracking-wide uppercase"
            >
              <Icon
                className={cn(
                  "size-5 transition-all duration-300",
                  isActive ? "scale-110 text-white" : "text-white/50"
                )}
              />
              <span
                className={cn(
                  "transition-colors duration-300",
                  isActive ? "text-white" : "text-white/50"
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
