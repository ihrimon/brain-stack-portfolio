"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/GSAPAnimations"
import type { CaseStudy } from "@/lib/data/caseStudies"
import { caseStudiesPageData } from "@/lib/data/caseStudiesPage"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

const FEATURED_COUNT = 4

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[]
  className?: string
}

export default function CaseStudiesSection({ caseStudies, className }: CaseStudiesSectionProps) {
  const featuredCaseStudies = caseStudies.slice(0, FEATURED_COUNT)

  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])

      if (!cardsRef.current) return

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-case-study-card]",
        cardsRef.current
      )
      const lastCard = cards[cards.length - 1]

      // Each earlier card stays pinned (stacked, covered by the next ones)
      // all the way until the LAST card reaches its own reveal point —
      // not just until the next card arrives — so nothing flies off early.
      // Only the last card releases naturally, letting the page continue.
      cards.forEach((card, index) => {
        const isLast = index === cards.length - 1

        ScrollTrigger.create({
          trigger: card,
          start: "top top+=96",
          endTrigger: isLast ? card : lastCard,
          end: isLast ? "bottom top" : "top top+=96",
          pin: true,
          pinSpacing: isLast,
        })
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      className={cn("bg-brand-dark py-20 sm:py-28", className)}
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionBadge>{caseStudiesPageData.badge}</SectionBadge>

            <h2
              ref={titleRef}
              className="mt-8 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
            >
              {caseStudiesPageData.title}
            </h2>

            <p
              ref={descRef}
              className="mt-6 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base"
            >
              {caseStudiesPageData.description}
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2">
              <span className="text-lg font-semibold text-white">
                {caseStudiesPageData.stat.value}
              </span>
              <span className="text-xs tracking-widest text-white/50 uppercase">
                {caseStudiesPageData.stat.label}
              </span>
            </div>
          </div>

          <Link
            href="/case-studies"
            className="mt-2 flex items-center gap-3 text-sm font-medium text-white hover:text-white/80"
            data-cursor="magnetic"
          >
            <span className="h-px w-10 bg-white/40" />
            View All
          </Link>
        </div>

        <div ref={cardsRef} className="relative">
          {featuredCaseStudies.map((item, index) => (
            <div
              key={item.id}
              data-case-study-card
              className="overflow-hidden border-t border-white/10 bg-neutral-900"
              style={{ zIndex: index + 1 }}
            >
              <div className="grid min-h-[70vh] md:grid-cols-2">
                <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16">
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
                      {item.category}
                    </span>

                    <h3 className="mt-4 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                      {item.overview}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {item.solution.keySolutions.slice(0, 4).map((solution) => (
                        <li
                          key={solution}
                          className="flex items-center gap-2 text-sm text-white/70 sm:text-base"
                        >
                          <span className="size-1 shrink-0 rounded-full bg-white/40" />
                          {solution}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {item.technologies.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <PrimaryButton href={`/case-studies/${item.slug}`} className="mt-10">
                    View case study
                  </PrimaryButton>
                </div>

                <div className="relative min-h-64 md:min-h-0">
                  <Image
                    src={item.heroImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
