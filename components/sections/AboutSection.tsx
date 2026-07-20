"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { WhoWeAreData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface AboutSectionProps {
  data: WhoWeAreData
}

export default function AboutSection({ data }: AboutSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const statsListRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Title starts muted and reveals word-by-word as the section is
      // scrolled through, rather than fading in all at once.
      gsap.effects.textRevealOnScroll(titleRef.current)

      if (statsListRef.current) {
        // Each stat row fades in and slides up as the list enters view.
        gsap.effects.staggerFadeUpOnScroll(statsListRef.current, {
          start: "top 85%",
        })

        // Count the stats up once the list enters view.
        const values = gsap.utils.toArray<HTMLElement>(
          "[data-stat-value]",
          statsListRef.current
        )

        ScrollTrigger.create({
          trigger: statsListRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            values.forEach((el) => {
              const target = Number(el.dataset.statValue)
              const counter = { value: 0 }
              gsap.to(counter, {
                value: target,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = Math.round(counter.value).toString()
                },
              })
            })
          },
        })
      }

      // No manual cleanup here — useGSAP's automatic gsap.context().revert()
      // (scoped to sectionRef) already tears down every tween/ScrollTrigger
      // created in this callback, including the ones above. A prior version
      // of this cleanup called `ScrollTrigger.getAll().forEach(t => t.kill())`,
      // which kills *every* ScrollTrigger on the page, not just this
      // component's own — a latent risk under fast client-side navigation
      // where a still-mounted sibling section's ScrollTrigger could get
      // killed by this component unmounting.
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

          <div ref={statsListRef} className="flex flex-col gap-6">
            {data.stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-3xl  bg-white/5 p-6 border border-white/20 backdrop-blur-xl sm:p-10"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-4xl font-medium text-white sm:text-5xl">
                    <span data-stat-value={stat.value}>0</span>
                    {stat.suffix}
                  </p>
                  <p className="text-sm tracking-wide text-white/50 uppercase transition-colors duration-300 group-hover:text-white sm:text-lg">
                    {stat.label}
                  </p>
                </div>
                <p className="mt-4 text-white/70 transition-colors duration-300 group-hover:text-white">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
