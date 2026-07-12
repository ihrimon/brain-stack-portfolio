"use client"

import "@/lib/GSAPAnimations"
import { servicesPageData } from "@/lib/data/servicesPage"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { SectionBadge } from '../common/SectionBadge'

const { process } = servicesPageData

export default function ServiceProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
      gsap.effects.staggerFadeUpOnScroll("[data-steps]", { childSelector: "[data-step]" })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
          <SectionBadge className="mb-12">Services Timeline</SectionBadge>
          <h2
            ref={titleRef}
            className="mt-8 max-w-4xl text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl md:text-5xl uppercase"
          >
            {process.title}
          </h2>

        <div data-steps className="mt-16 border-b border-dashed border-white/15 sm:mt-20">
          {process.steps.map((step, index) => (
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
