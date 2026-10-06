"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef, type ReactNode } from "react"

interface StatusPageProps {
  /** Large faint background digits, e.g. "404" or "500". */
  watermark: string
  badge: string
  title: string
  description: string
  /** CTA button(s) rendered below the description. */
  children: ReactNode
}

/** Shared layout for app/error.tsx and app/not-found.tsx — the only two
 * route-level status pages, both a giant watermark + badge + heading +
 * description + CTA(s), previously duplicated between the two files. */
export function StatusPage({
  watermark,
  badge,
  title,
  description,
  children,
}: StatusPageProps) {
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
        className="footer-slang pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-heading leading-none font-black text-white/5 select-none"
      >
        {watermark}
      </span>

      <div className="relative mx-auto flex max-w-site flex-col items-center px-4 text-center lg:px-6">
        <div data-reveal>
          <SectionBadge>{badge}</SectionBadge>
        </div>

        <h1
          data-reveal
          className="mt-8 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
        >
          {title}
        </h1>

        <p data-reveal className="mt-4 max-w-md text-white/60">
          {description}
        </p>

        <div
          data-reveal
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {children}
        </div>
      </div>
    </section>
  )
}
