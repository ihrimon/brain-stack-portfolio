"use client"

import { DiagonalPattern } from "@/components/animations/DiagonalPattern"
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
    <section ref={sectionRef} className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <SectionBadge>{approach.badge}</SectionBadge>

        <h2
          ref={titleRef}
          className="mt-8 max-w-3xl text-4xl leading-tight font-medium tracking-tight text-white uppercase sm:text-5xl md:text-6xl"
        >
          {approach.title}
        </h2>

        <div className="mt-16 grid gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {approach.items.map((step) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-2xl bg-neutral-900 p-8"
            >
              <DiagonalPattern className="[mask-image:linear-gradient(to_bottom,black,transparent_70%)] opacity-60" />

              <h3 className="relative text-2xl leading-tight font-medium text-white">
                {step.title}
              </h3>

              <ul className="relative mt-6 space-y-2">
                {step.items.map((item) => (
                  <li key={item} className="text-sm text-white/50 sm:text-base">
                    {item}
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
