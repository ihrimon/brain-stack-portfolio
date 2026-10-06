"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
import { ServiceAccordion } from "@/components/sections/services/ServiceAccordion"
import "@/lib/animations/gsap-animations"
import type { ServicesData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface WhatWeDoSectionProps {
  data: ServicesData
}

export default function WhatWeDoSection({ data }: WhatWeDoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current])
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className="py-20 sm:py-28"
    >
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <HeadingSection badge={data.badge} title={data.title} titleRef={titleRef} />
      </div>

      <div className="mt-14 sm:mt-16">
        <ServiceAccordion items={data.items} />
      </div>
    </section>
  )
}
