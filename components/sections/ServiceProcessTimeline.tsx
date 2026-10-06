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
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="grid gap-6 border-t border-line pt-8 lg:grid-cols-12 lg:gap-8">
          <SectionBadge variant="label" dot className="lg:col-span-3">
            {process.badge}
          </SectionBadge>
          <h2
            ref={titleRef}
            className="max-w-4xl heading-section text-ink uppercase lg:col-span-9"
          >
            {process.title}
          </h2>
        </div>

        {/* Indented to the title's column on desktop, so the steps read as
            the title's own list rather than a separate block. */}
        <ol data-steps className="mt-16 border-b border-line sm:mt-20 lg:ml-[25%]">
          {process.items.map((step, index) => (
            <li
              key={step.title}
              data-step
              className="group grid gap-4 border-t border-line py-8 sm:grid-cols-[5rem_1fr_1fr] sm:gap-8 sm:py-10"
            >
              <span className="font-mono text-[11px] tracking-wider text-ink-2 tabular-nums transition-colors duration-300 group-hover:text-signal-text">
                [{String(index + 1).padStart(2, "0")}]
              </span>
              <h3 className="text-2xl leading-tight font-medium tracking-tight text-ink sm:text-3xl">
                {step.title}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-ink-2 sm:text-base">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
