"use client"

import { servicesData } from "@/lib/data/services"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { SectionBadge } from "../common/SectionBadge"

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  // Crossfades the right-side image whenever a different title is hovered.
  // The title's own hover feedback (color/underline/shift) stays pure CSS —
  // this state only exists to drive which image is currently showing, and
  // it stays on the last-hovered item rather than resetting on mouse-out.
  useEffect(() => {
    imageRefs.current.forEach((el, index) => {
      if (!el) return

      const isActive = index === activeIndex
      gsap.to(el, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 1.06,
        duration: 0.6,
        ease: "power2.out",
      })
    })
  }, [activeIndex])

  return (
    <section id="services" className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
          <SectionBadge>{servicesData.badge}</SectionBadge>
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_minmax(0,580px)] lg:items-center lg:gap-16">
          <div className="flex flex-col">
            {servicesData.items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                className="group/title w-fit cursor-pointer py-2 text-left sm:py-3"
                data-cursor="magnetic"
              >
                <span className="relative inline-block text-3xl leading-tight font-bold tracking-tight text-white/30 uppercase transition-colors duration-300 group-hover/title:text-white sm:text-4xl md:text-5xl">
                  <span className="inline-block transition-transform duration-300 ease-out group-hover/title:translate-x-3">
                    {item.title}
                  </span>
                  <span className="absolute -bottom-1 left-0 h-0.75 w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover/title:scale-x-100" />
                </span>
              </button>
            ))}
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-900">
            {servicesData.items.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => {
                  imageRefs.current[index] = el
                }}
                className={cn(
                  "absolute inset-0",
                  index === 0 ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 380px, 90vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
