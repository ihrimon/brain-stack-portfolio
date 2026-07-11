"use client"

import "@/lib/GSAPAnimations"
import { teamData } from "@/lib/data/team"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Image from "next/image"
import { useRef } from "react"
import { SectionBadge } from '../common/SectionBadge'

gsap.registerPlugin(ScrollTrigger)

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])

      if (!cardsRef.current) return

      // Odd-indexed cards drift upward along the y-axis as the section
      // scrolls through the viewport, staggering the grid into a subtle
      // parallax rather than all four cards moving as one flat block.
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-team-card]",
        cardsRef.current
      )
      const oddCards = cards.filter((_, index) => index % 2 === 1)

      gsap.to(oddCards, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="team"
      ref={sectionRef}
      className="overflow-hidden bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="max-w-4xl">
          <SectionBadge>{teamData.badge}</SectionBadge>

          <h2
            ref={titleRef}
            className="mt-8 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
          >
            {teamData.title}
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="mt-16 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4"
        >
          {teamData.members.map((member) => (
            <div key={member.name} data-team-card>
              <div className="relative aspect-4/5 origin-bottom overflow-hidden border border-white/10 bg-neutral-900 transition-transform duration-500 ease-out hover:translate-x-1 hover:-skew-x-1">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 45vw"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-sm text-white/50">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
