"use client"

import type { ServiceOffering } from "@/lib/data/shared-types"
import gsap from "gsap"
import { useEffect, useRef } from "react"
import { FeaturedServiceCard } from "./FeaturedServiceCard"
import { ServicePreviewCard } from "./ServicePreviewCard"

interface ServiceCarouselProps {
  items: ServiceOffering[]
  activeIndex: number
  onSelect: (index: number) => void
}

// Tablet shows the featured card plus 3 previews; the rest re-appear at the
// desktop breakpoint where there's room for the full vertical rail.
const TABLET_VISIBLE_PREVIEWS = 3

export function ServiceCarousel({
  items,
  activeIndex,
  onSelect,
}: ServiceCarouselProps) {
  const featuredRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  const activeItem = items[activeIndex]

  // Crossfades + scales the featured card in whenever a different service
  // becomes active, instead of an instant swap. Skipped on mount (nothing to
  // transition from) and skipped entirely under reduced-motion.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const el = featuredRef.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.fromTo(
      el,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    )
  }, [activeIndex])

  const previews = items
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index !== activeIndex)

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="lg:flex-[2.2]">
        <FeaturedServiceCard ref={featuredRef} item={activeItem} />
      </div>

      <div
        data-preview-rail
        className="flex gap-4 overflow-x-auto pb-1 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {previews.map(({ item, index }, previewIndex) => (
          <ServicePreviewCard
            key={item.slug ?? item.id ?? item.title}
            item={item}
            onSelect={() => onSelect(index)}
            className={
              previewIndex >= TABLET_VISIBLE_PREVIEWS
                ? "md:hidden lg:flex"
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
