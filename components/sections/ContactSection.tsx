"use client"

import "@/lib/GSAPAnimations"
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
        <div className="flex items-end justify-between">
          <h2
            ref={titleRef}
            className="mt-8 max-w-4xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-[84px]"
          >
            Ready to build something great together
          </h2>

          <p
            ref={descRef}
            className="mt-6 max-w-xl text-2xl leading-relaxed text-white/70"
          >
            Have a project in mind or just want to say hello? Reach out and our
            team will get back to you within one business day.
          </p>
        </div>
      </div>
    </section>
  )
}
