"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { ExclusiveServicesData } from "@/lib/data/service-page"
import { resolveIcon } from "@/lib/utils/icons"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface ExclusiveServicesProps {
  exclusiveServices: ExclusiveServicesData
}

export default function ExclusiveServices({ exclusiveServices }: ExclusiveServicesProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])
      gsap.effects.staggerFadeUpOnScroll("[data-service-grid]", {
        childSelector: "[data-service-card]",
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="grid gap-6 border-t border-line pt-8 lg:grid-cols-12 lg:gap-8">
          <SectionBadge className="lg:col-span-3">{exclusiveServices.badge}</SectionBadge>
          <div className="lg:col-span-9">
            <h2
              ref={titleRef}
              className="max-w-2xl heading-section text-ink uppercase"
            >
              {exclusiveServices.title}
            </h2>
            <p
              ref={descRef}
              className="mt-6 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg"
            >
              {exclusiveServices.description}
            </p>
          </div>
        </div>

        <div
          data-service-grid
          className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {exclusiveServices.items.map((category, index) => {
            const Icon = resolveIcon(category.icon)

            return (
              <div
                key={category.title}
                data-service-card
                className="group flex flex-col rounded-3xl border border-line bg-paper-2 p-6 transition-colors duration-500 hover:border-signal/60 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-signal/10 text-signal transition-colors duration-500 group-hover:bg-signal group-hover:text-signal-ink">
                    <Icon className="size-7" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-[11px] tracking-wider text-ink-2">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-10 text-xl leading-tight font-medium tracking-tight text-ink sm:text-2xl">
                  {category.title}
                </h3>

                <ul className="mt-6 divide-y divide-line border-t border-line">
                  {category.items.map((item) => (
                    <li key={item} className="py-2.5 text-sm text-ink-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
