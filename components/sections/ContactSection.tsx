"use client"

import "@/lib/animations/gsap-animations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(descRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section id="contact" ref={sectionRef} className="pt-28 pb-12 sm:pt-36">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        {/* The page's heading — this route had no h1 before. */}
        <h1 className="rise-up max-w-[9.4em] text-[clamp(3rem,8vw,8.5rem)] leading-[0.9] font-medium tracking-[-0.05em] text-ink uppercase">
          Ready to build something?
        </h1>

        <div className="mt-12 grid gap-8 border-t border-line pt-10 sm:mt-16 lg:grid-cols-12">
          <p
            ref={descRef}
            className="max-w-2xl text-xl leading-snug tracking-tight text-ink sm:text-2xl lg:col-span-7 lg:col-start-6"
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
