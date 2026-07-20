"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { ServicesData } from "@/lib/data/home-page"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef, useState } from "react"
import { ServiceCarousel } from "./services/ServiceCarousel"
import { ServiceControls } from "./services/ServiceControls"
import { ServiceDetails } from "./services/ServiceDetails"

gsap.registerPlugin(ScrollTrigger)

interface ServicesSectionProps {
  data: ServicesData
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  const activeItem = data.items[activeIndex]

  const goTo = (direction: 1 | -1) => {
    setActiveIndex(
      (current) => (current + direction + data.items.length) % data.items.length
    )
  }

  // Sequenced reveal as the section scrolls into view: header text, then the
  // featured card, then the preview rail (staggered per card), then the
  // bottom detail block — each its own ScrollTrigger at the natural point it
  // enters the viewport, rather than one shared timeline.
  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])

      gsap.effects.fadeUpOnScroll("[data-featured-card]", {
        start: "top 80%",
        yOffset: 50,
      })

      gsap.effects.staggerFadeUpOnScroll("[data-preview-rail]", {
        start: "top 85%",
        childSelector: "[data-preview-card]",
      })

      gsap.effects.fadeUpOnScroll("[data-service-details]", {
        start: "top 88%",
        yOffset: 30,
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-neutral-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <SectionBadge>{data.badge}</SectionBadge>

            <h2
              ref={titleRef}
              className="mt-8 max-w-4xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
            >
              {data.title}
            </h2>

            {/* <p
              ref={descRef}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            >
              {data.description}
            </p> */}
          </div>

          <ServiceControls onPrev={() => goTo(-1)} onNext={() => goTo(1)} />
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Our services"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") goTo(-1)
            if (event.key === "ArrowRight") goTo(1)
          }}
          className="mt-16 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
        >
          <ServiceCarousel
            items={data.items}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 lg:hidden">
          {data.items.map((item, index) => (
            <button
              key={item.slug ?? item.id ?? item.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${item.title}`}
              aria-current={index === activeIndex}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/20"
              )}
            />
          ))}
        </div>

        <div data-service-details className="mt-16">
          <ServiceDetails item={activeItem} />
        </div>
      </div>
    </section>
  )
}
