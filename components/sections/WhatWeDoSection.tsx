"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
import { ServicesStack } from "@/components/sections/services/ServicesStack"
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
      className="bg-neutral-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-4 sm:px-8">
        <HeadingSection badge={data.badge} title={data.title} titleRef={titleRef} />
      </div>

      <div>
        <ServicesStack items={data.items} />
      </div>
    </section>
  )
}
