"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useEffect, useRef } from "react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.effects.fadeUp("[data-reveal]", { stagger: 0.12 })
    },
    { scope: containerRef }
  )

  // Minimal logging so a failure is at least visible in server/browser logs.
  // Swap this for a real error-tracking service (Sentry, etc.) if one gets
  // added — this is the one place in the app that would need to change.
  useEffect(() => {
    console.error("[app/error.tsx] Unhandled error in a route segment:", error)
  }, [error])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-brand-dark py-24"
    >
      <span
        aria-hidden="true"
        className="footer-slang pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-heading leading-none font-black text-white/5 select-none"
      >
        500
      </span>

      <div className="relative mx-auto flex max-w-400 flex-col items-center px-5 text-center sm:px-8">
        <div data-reveal>
          <SectionBadge>Something Went Wrong</SectionBadge>
        </div>

        <h1
          data-reveal
          className="mt-8 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
        >
          Unexpected Error
        </h1>

        <p data-reveal className="mt-4 max-w-md text-white/60">
          Something went wrong loading this page. Try again, or head back to
          the homepage.
        </p>

        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <PrimaryButton onClick={reset}>Try Again</PrimaryButton>
          <PrimaryButton href="/" showArrow={false}>
            Back to Home
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}
