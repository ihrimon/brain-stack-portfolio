"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
import "@/lib/animations/gsap-animations"
import type { WhoWeAreData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import dynamic from "next/dynamic"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

// three.js + React Three Fiber are a heavy dependency for a purely
// decorative, pointer-driven, aria-hidden canvas — loading it client-only
// keeps it out of this page's server-rendered bundle entirely, matching
// the same dynamic-import-with-no-fallback approach HeroSection.tsx uses
// for HeroBackground.
const BrainWireframe = dynamic(
  () => import("@/components/three/BrainWireframe").then((mod) => mod.BrainWireframe),
  { ssr: false }
)

interface WhoWeAreSectionProps {
  data: WhoWeAreData
}

export default function WhoWeAreSection({ data }: WhoWeAreSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Title and description start muted and reveal word-by-word as the
      // section is scrolled through, rather than fading in all at once.
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="who-we-are"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28 bg-surface-dark"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <HeadingSection
          badge={data.badge}
          title={data.title}
          titleRef={titleRef}
          link={{ label: data.button.label, href: data.button.href }}
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.7fr_1fr] lg:items-stretch lg:gap-x-20">
          <div
            ref={descRef}
            className="max-w-2xl space-y-4 text-lg leading-relaxed text-white/70"
          >
            {/* `description` is normally an array of paragraphs (see
                lib/data/home-page.ts) — coerce defensively in case a single
                string is ever passed instead. */}
            {(Array.isArray(data.description)
              ? data.description
              : [data.description]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="relative mx-auto h-90 w-full max-w-md sm:h-120 lg:mx-0 lg:h-full lg:max-w-none">
            <BrainWireframe className="absolute inset-0 size-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
