"use client"

import { LazyBrain3D } from "@/components/animations/LazyBrain3D"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { CtaData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface CTASectionProps {
  data: CtaData
}

/**
 * Closing call to action, modelled on Cuberto's outro: a dark panel with
 * one centered stack — label, large heading, short paragraph, button — over
 * the same 3D brain the hero uses (turns toward the pointer anywhere over
 * the section). The brain is edge-faded and kept behind a soft vignette so
 * the copy always reads.
 */
export default function CTASection({ data }: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
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
      // Dark in both themes — the one deliberate contrast block on the page.
      data-theme="dark"
      className="relative isolate overflow-hidden bg-paper text-ink"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 size-[60vw] max-w-250 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/20 blur-[140px]" />
        <div className="absolute inset-0 opacity-70">
          <LazyBrain3D className="mask-[radial-gradient(ellipse_50%_60%_at_50%_50%,black_40%,transparent_85%)]" />
        </div>
        {/* Vignette: darkens the centre slightly behind the copy. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,rgb(10_10_10/0.55),transparent_75%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-site flex-col items-center px-4 py-28 text-center sm:py-36 lg:px-6 lg:py-44">
        <SectionBadge className="self-center">Let&apos;s Talk</SectionBadge>

        <h2
          ref={titleRef}
          className="mt-8 max-w-[12em] text-[clamp(2.5rem,min(4.6vw,7.5vh),5rem)] leading-[0.98] font-medium tracking-[-0.045em]"
        >
          {data.title}
        </h2>

        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/75 sm:mt-8 sm:text-lg">
          {data.description}
        </p>

        <div className="mt-12">
          <PrimaryButton href={data.button.href}>{data.button.label}</PrimaryButton>
        </div>
      </div>
    </section>
  )
}
