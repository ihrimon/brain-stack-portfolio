"use client"

import { ServiceContent } from "@/components/sections/services/ServiceContent"
import { ServiceRow } from "@/components/sections/services/ServiceRow"
import { ServiceVisual } from "@/components/sections/services/ServiceVisual"
import { useServicesScrollStack } from "@/hooks/useServicesScrollStack"
import type { ServiceOffering } from "@/lib/data/shared-types"
import { useRef, useState } from "react"

interface ServicesStackProps {
  items: ServiceOffering[]
}

// Fixed pixel height for the desktop image window — must be tall enough to
// fit ServiceVisual's tallest image height plus its offset (currently
// 500 + 56 = 556px), since every slide in the track is forced to this same
// height so the scroll math in useServicesScrollStack can assume one
// consistent slide height. Deliberately taller than that minimum — each
// slide centers its ServiceVisual vertically (`justify-center` below)
// within the extra room instead of pinning it to the top.
const VISUAL_WINDOW_HEIGHT = "h-[760px]"

export function ServicesStack({ items }: ServicesStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const mobileListRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useServicesScrollStack({
    containerRef,
    pinRef,
    windowRef,
    trackRef,
    mobileListRef,
    itemCount: items.length,
    onIndexChange: setActiveIndex,
  })

  const activeItem = items[activeIndex]

  return (
    <div ref={containerRef} className="relative">
      {/* Below `lg`, or with reduced motion at any width: a plain stacked
          list — each service's own content + visual pair, in normal flow,
          revealed with a fade-up as it scrolls in. See
          useServicesScrollStack.ts for the matching `listVisible` check. */}
      <div
        ref={mobileListRef}
        className="mx-auto flex max-w-400 flex-col gap-16 px-4 sm:px-8 lg:motion-safe:hidden"
      >
        {items.map((item, index) => (
          <ServiceRow
            key={item.slug ?? item.id ?? item.title}
            item={item}
            index={index}
            priority={index === 0}
          />
        ))}
      </div>

      {/* `lg` and up, motion-safe only: content stays pinned in place for
          the whole stack; only the image column advances, scrubbed to
          scroll. */}
      <div ref={pinRef} className="relative hidden lg:motion-safe:block">
        <div className="mx-auto grid max-w-400 grid-cols-[1fr_1.3fr] gap-16 px-8">
          <ServiceContent item={activeItem} index={activeIndex} />

          <div ref={windowRef} className={`relative overflow-hidden ${VISUAL_WINDOW_HEIGHT}`}>
            <div ref={trackRef} className="flex flex-col">
              {items.map((item, index) => (
                <div
                  key={item.slug ?? item.id ?? item.title}
                  className={`flex shrink-0 flex-col justify-center ${VISUAL_WINDOW_HEIGHT}`}
                >
                  <ServiceVisual
                    title={item.title}
                    index={index}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
