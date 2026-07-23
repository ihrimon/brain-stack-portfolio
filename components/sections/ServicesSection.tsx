"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import { ServicesStack } from "@/components/sections/services/ServicesStack"
import "@/lib/animations/gsap-animations"
import type { ServicesData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface ServicesSectionProps {
  data: ServicesData
}

export default function ServicesSection({ data }: ServicesSectionProps) {
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
      id="services"
      ref={sectionRef}
      className="bg-neutral-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-30">
          <SectionBadge>{data.badge}</SectionBadge>

          <h2
            ref={titleRef}
            className="max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {data.title}
          </h2>
        </div>
      </div>

      <div>
        <ServicesStack items={data.items} />
      </div>
    </section>
  )
}
