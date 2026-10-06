"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { AboutApproachData } from "@/lib/data/about-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface AboutApproachProps {
  approach: AboutApproachData
}

export default function AboutApproach({ approach }: AboutApproachProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="grid gap-6 border-t border-line pt-8 lg:grid-cols-[auto_1fr] lg:gap-10">
          <SectionBadge>{approach.badge}</SectionBadge>
          <h2
            ref={titleRef}
            className="max-w-3xl heading-section text-ink uppercase"
          >
            {approach.title}
          </h2>
        </div>

        {/* Four columns joined by hairlines — a process read left to right
            rather than four boxed cards. */}
        <ol className="mt-16 grid border-t border-line sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {approach.items.map((step, index) => (
            <li
              key={step.title}
              className="group relative border-b border-line py-8 sm:odd:pr-6 sm:even:border-l sm:even:pl-6 lg:border-b-0 lg:border-l lg:px-8 lg:py-10 lg:odd:pr-8 lg:even:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="font-mono text-[11px] tracking-wider text-signal-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-2xl leading-tight font-medium tracking-tight text-ink">
                {step.title}
              </h3>
              <ul className="mt-6 space-y-2">
                {step.items.map((item) => (
                  <li key={item} className="text-sm text-ink-2 sm:text-base">
                    {item}
                  </li>
                ))}
              </ul>
              {/* Signal hairline that draws in along the top on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-signal transition-transform duration-700 ease-premium group-hover:scale-x-100"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
