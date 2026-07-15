"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import "@/lib/animations/gsap-animations"
import type { HeroBannerData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(SplitText)

interface HeroSectionProps {
  data: HeroBannerData
}

export default function HeroSection({ data }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const headingElement = heroRef.current?.querySelector("h1")
      if (!headingElement) return

      SplitText.create(headingElement, {
        type: "lines, words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            duration: 0.6,
            y: 10,
            opacity: 0.5,
            filter: "blur(6px)",
            autoAlpha: 0,
            stagger: 0.06,
          })
        },
      })
    },
    { scope: heroRef }
  )

  return (
    <div className="flex flex-col flex-nowrap">
      <div
        ref={heroRef}
        className="relative flex min-h-screen w-full flex-col overflow-hidden bg-brand-dark"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex w-full max-w-400 flex-1 flex-col justify-center px-5 pt-32 pb-20 sm:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="flex flex-col gap-8">
              <h1 className="mb-6 max-w-4xl text-5xl font-medium tracking-tight text-white uppercase lg:text-[84px]">
                {data.title}{" "}
              </h1>

              <PrimaryButton href={data.button.href}>
                {data.button.label}
              </PrimaryButton>
            </div>

            <div className="lg:w-130 lg:shrink-0">
              <p className="text-base leading-relaxed text-white/70 sm:text-2xl">
                {data.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
