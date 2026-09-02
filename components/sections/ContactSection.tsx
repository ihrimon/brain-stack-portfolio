"use client"

import "@/lib/animations/gsap-animations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-brand-dark pt-32 pb-12 sm:pt-30"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            ref={titleRef}
            className="mt-8 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-6xl"
          >
            Ready to build something?
          </h2>

          <p
            ref={descRef}
            className="max-w-xl text-xl leading-relaxed text-white/70 sm:text-2xl"
          >
            Tell us what you&apos;re building and who it&apos;s for. We work
            best with founders and businesses in fintech, healthcare, SaaS,
            and regulated industries. We&apos;ll get back within 24 hours —
            honest assessment, no pitch, no obligation.
          </p>
        </div>
      </div>
    </section>
  )
}
