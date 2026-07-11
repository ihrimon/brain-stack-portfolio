"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/GSAPAnimations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.effects.fadeUp("[data-reveal]", { stagger: 0.12 })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-brand-dark py-24"
    >
      <span
        aria-hidden="true"
        className="footer-slang font-heading pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center leading-none font-black text-white/5 select-none"
      >
        404
      </span>

      <div className="relative mx-auto flex max-w-400 flex-col items-center px-5 text-center sm:px-8">
        <div data-reveal>
          <SectionBadge>404 Error</SectionBadge>
        </div>

        <h1
          data-reveal
          className="mt-8 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
        >
          Page Not Found
        </h1>

        <p data-reveal className="mt-4 max-w-md text-white/60">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div data-reveal className="mt-10">
          <PrimaryButton href="/">Back to Home</PrimaryButton>
        </div>
      </div>
    </section>
  )
}
