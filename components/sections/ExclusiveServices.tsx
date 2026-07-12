"use client"

import "@/lib/GSAPAnimations"
import { servicesPageData } from "@/lib/data/servicesPage"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

const { exclusiveServices } = servicesPageData

export default function ExclusiveServices() {
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
    <section ref={sectionRef} className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
          <h2
            ref={titleRef}
            className="max-w-lg text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl uppercase"
          >
            {exclusiveServices.title}
          </h2>

        <div
          data-service-grid
          className="mt-16 grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 sm:mt-20 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:border-t-0"
        >
          {exclusiveServices.categories.map((category) => (
            <div
              key={category.title}
              data-service-card
              className="py-8 first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0"
            >
              <category.icon className="size-8 text-white" strokeWidth={1.5} />

              <h3 className="mt-6 text-xl leading-tight font-medium text-white sm:text-2xl">
                {category.title}
              </h3>

              <ul className="mt-6 space-y-2">
                {category.items.map((item) => (
                  <li key={item} className="text-sm text-white/50">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
