"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
import { LazyBrain3D } from "@/components/animations/LazyBrain3D"
import "@/lib/animations/gsap-animations"
import type { WhoWeAreData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

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
      className="relative z-10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <HeadingSection
          badge={data.badge}
          title={data.title}
          titleRef={titleRef}
          link={{ label: data.button.label, href: data.button.href }}
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-stretch lg:gap-x-16">
          <div
            ref={descRef}
            className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-ink-2 sm:text-lg"
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

          {/* The same real 3D brain as the hero (holographic point cloud,
              turns toward the pointer anywhere over this section). Loaded
              lazily, so it costs nothing until the page has settled. */}
          <div className="relative mx-auto h-80 w-full sm:h-110 lg:mx-0 lg:h-full lg:min-h-110">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[12%] rounded-full bg-signal/20 blur-[90px] light:bg-signal/10"
            />
            <LazyBrain3D delay={300} />
          </div>
        </div>
      </div>
    </section>
  )
}
