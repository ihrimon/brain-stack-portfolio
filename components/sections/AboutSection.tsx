"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { WhoWeAreData } from "@/lib/data/home-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Image from "next/image"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface AboutSectionProps {
  data: WhoWeAreData
}

export default function AboutSection({ data }: AboutSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      // Title starts muted and reveals word-by-word as the section is
      // scrolled through, rather than fading in all at once.
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="company"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.7fr_1fr] lg:gap-20">
          <div className="flex flex-col lg:max-w-3xl">
            <SectionBadge className="mb-8 w-fit">{data.badge}</SectionBadge>

            <h2
              ref={titleRef}
              className="max-w-4xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
            >
              {data.title}
            </h2>

            <PrimaryButton href={data.button.href} className="mt-10">
              {data.button.label}
            </PrimaryButton>
          </div>

          <div className="relative mx-auto aspect-4/7 w-full max-w-sm lg:mx-0 lg:max-w-md">
            <Image
              src="/images/neural-pathways.jpg"
              alt="Neural network visualization forming the shape of a brain"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 30vw, 80vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
