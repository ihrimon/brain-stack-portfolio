"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { ServiceProcessData } from "@/lib/data/service-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface ServiceProcessTimelineProps {
  process: ServiceProcessData
}

export default function ServiceProcessTimeline({ process }: ServiceProcessTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
      gsap.effects.staggerFadeUpOnScroll("[data-steps]", {
        childSelector: "[data-step]",
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <SectionBadge variant="label" className="mb-12">
          {process.badge}
        </SectionBadge>
        <h2
          ref={titleRef}
          className="mt-8 max-w-4xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
        >
          {process.title}
        </h2>

        <div
          data-steps
          className="mt-16 border-b border-dashed border-white/15 sm:mt-20"
        >
          {process.items.map((step, index) => (
            <div
              key={step.title}
              data-step
              className="grid gap-4 border-t border-dashed border-white/15 py-8 sm:grid-cols-[80px_1fr_1fr] sm:gap-8 sm:py-10"
            >
              <span className="text-sm text-white/40 tabular-nums">
                [{String(index + 1).padStart(2, "0")}]
              </span>

              <h3 className="text-2xl leading-tight font-medium text-white sm:text-3xl">
                {step.title}
              </h3>

              <p className="max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
