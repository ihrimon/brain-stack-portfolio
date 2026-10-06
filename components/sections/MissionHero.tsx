"use client"

import "@/lib/animations/gsap-animations"
import type { AboutMissionData } from "@/lib/data/about-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import { useRef, type ReactNode } from "react"

function renderHighlighted(
  text: string,
  highlights: readonly string[]
): ReactNode {
  if (highlights.length === 0) return text

  const pattern = new RegExp(
    `(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g"
  )

  return text.split(pattern).map((part, index) =>
    highlights.includes(part) ? (
      <strong key={index} className="font-medium text-ink">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

interface MissionHeroProps {
  data: AboutMissionData
}

export default function MissionHero({ data }: MissionHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Same staggered fade-up the home hero uses for its supporting copy.
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-mission-reveal]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.2,
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <h1 className="rise-up max-w-[9.4em] text-[clamp(3rem,8.5vw,9rem)] leading-[0.9] font-medium tracking-[-0.05em] text-ink uppercase">
          {data.title}
        </h1>

        <div className="mt-16 grid gap-12 border-t border-line pt-10 sm:mt-24 lg:grid-cols-12 lg:gap-8">
          <div data-mission-reveal className="lg:col-span-4">
            <h2 className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
              {data.statement.title}
            </h2>
            <p className="mt-6 max-w-lg text-xl leading-snug tracking-tight text-ink-2 sm:text-2xl">
              {renderHighlighted(data.statement.description, data.statement.highlights)}
            </p>
          </div>

          <div data-mission-reveal className="lg:col-span-4">
            <h2 className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
              {data.pillars.title}
            </h2>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {data.pillars.items.map((item, index) => (
                <li key={item} className="flex items-baseline gap-4 py-3.5 text-base text-ink sm:text-lg">
                  <span className="font-mono text-[11px] text-ink-2">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div
            data-mission-reveal
            className="relative aspect-4/3 overflow-hidden rounded-3xl bg-paper-2 lg:col-span-4"
          >
            <Image
              src={data.image}
              alt="Brain Stack"
              fill
              priority
              fetchPriority="high"
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />

            <span className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-signal">
              <Image
                src="/logo-white.png"
                alt=""
                width={18}
                height={18}
                className="object-contain"
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
