"use client"

import "@/lib/GSAPAnimations"
import { aboutPageData } from "@/lib/data/aboutPage"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowRight } from "lucide-react"
import { Fragment, useRef } from "react"

const { approach } = aboutPageData

export default function AboutApproach() {
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
        <div className="grid gap-6 lg:grid-cols-[140px_1fr] lg:gap-12">
          <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
            {approach.label}
          </span>

          <h2
            ref={titleRef}
            className="max-w-3xl text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {approach.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-[1fr_48px_1fr_48px_1fr] lg:items-start lg:gap-0">
          {approach.steps.map((step, index) => (
            <Fragment key={step.title}>
              <div>
                <h3 className="text-2xl leading-tight font-medium text-white sm:text-3xl">
                  {step.title}
                </h3>

                <ul className="mt-6 space-y-2">
                  {step.items.map((item) => (
                    <li key={item} className="text-sm text-white/50 sm:text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {index < approach.steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden items-center justify-center pt-6 lg:flex"
                >
                  <span className="relative h-px w-full bg-white/20">
                    <ArrowRight className="absolute top-1/2 right-0 size-4 -translate-y-1/2 text-white/30" />
                  </span>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
