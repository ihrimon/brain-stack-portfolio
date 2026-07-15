"use client"

import { DiagonalPattern } from "@/components/animations/DiagonalPattern"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import { ctaData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-brand-dark bg-neutral-900 pt-24 pb-0 sm:pt-32"
    >
      <DiagonalPattern className="[mask-image:linear-gradient(to_left,black,transparent_65%)] opacity-60" />

      <div className="relative mx-auto w-full max-w-400 px-5 pb-20 sm:px-8">
        <SectionBadge>Let&apos;s Talk</SectionBadge>

        <div className="mt-8 grid grid-cols-12 gap-10 lg:items-start lg:gap-16">
          <h2
            ref={titleRef}
            className="col-span-8 max-w-5xl text-4xl leading-[1.05] font-medium tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            {ctaData.title}
          </h2>

          <div className="col-span-4">
            <p className="max-w-md text-base leading-relaxed text-white/50 sm:text-xl">
              {ctaData.description}
            </p>

            <div className="mt-8">
              <PrimaryButton href={ctaData.button.href}>
                {ctaData.button.label}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
