"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { CtaData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import dynamic from "next/dynamic"
import { useRef } from "react"

// three.js + React Three Fiber are a heavy dependency for a purely
// decorative background — loading it client-only keeps it out of this
// page's server-rendered bundle entirely, matching the same
// dynamic-import-with-no-fallback approach HeroSection.tsx uses for the same
// component: the section's own dark background already paints immediately,
// so there's nothing for a loading fallback to prevent a flash of. Reusing
// HeroBackground here (rather than a bespoke CTA-only scene) keeps every
// section that shows this "liquid glass" blob field visually consistent.
const HeroBackground = dynamic(
  () =>
    import("@/components/three/hero-background/HeroBackground").then(
      (mod) => mod.HeroBackground
    ),
  { ssr: false }
)

interface CTASectionProps {
  data: CtaData
}

export default function CTASection({ data }: CTASectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)

      // Same subtle parallax as HeroSection.tsx: scrub the background
      // layer's yPercent as the section scrolls through the viewport,
      // independent of the WebGL scene's own cursor-driven motion. Scoped
      // to this section alone (`start "top bottom"` / `end "bottom top"`)
      // rather than HeroSection's shared-parent pin range, since this
      // section doesn't share a sticky background with a neighbor.
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          backgroundRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        )

        return () => {
          tween.scrollTrigger?.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden pt-24 pb-0 sm:pt-32"
      style={{
        // Matches the blobs' own base color (`#0c0d13` in
        // hero-background/constants.ts) exactly like HeroSection.tsx, so
        // the blobs blend into the backdrop at their edges here too.
        background:
          "linear-gradient(180deg, #060710 0%, #0c0d13 50%, #0a0b12 100%)",
      }}
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 h-full w-full scale-[1.15] will-change-transform"
      >
        <HeroBackground className="absolute inset-0 h-full w-full" />
      </div>

      <div className="relative mx-auto w-full max-w-400 px-5 pb-20 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-30">
            <SectionBadge>Let&apos;s Talk</SectionBadge>

            <div>
              <h2
                ref={titleRef}
                className="max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                {data.title}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-xl">
                {data.description}
              </p>
            </div>
          </div>

          <PrimaryButton href={data.button.href} className="shrink-0">
            {data.button.label}
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}
