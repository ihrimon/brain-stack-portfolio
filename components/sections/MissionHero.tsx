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
      <strong key={index} className="font-semibold text-white">
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
  const headingRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(headingRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="bg-brand-dark pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <h1
          ref={headingRef}
          className="text-5xl leading-[0.95] font-medium tracking-tight text-white uppercase sm:text-7xl md:text-6xl"
        >
          {data.title}
        </h1>

        <div className="mt-12 border-t border-white/10 sm:mt-20" />

        <div className="grid gap-10 pt-16 lg:grid-cols-[1fr_1px_1fr_1px_380px] lg:gap-16">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              {data.statement.title}
            </h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg">
              {renderHighlighted(
                data.statement.description,
                data.statement.highlights
              )}
            </p>
          </div>

          <div aria-hidden="true" className="hidden bg-white/10 lg:block" />

          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              {data.pillars.title}
            </h2>

            <ul className="mt-6 space-y-3">
              {data.pillars.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-base text-white/70 sm:text-lg"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-white/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div aria-hidden="true" className="hidden bg-white/10 lg:block" />

          <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-surface-dark">
            <Image
              src={data.image}
              alt="Brain Stack"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 380px, 100vw"
            />

            <span className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
              <Image
                src="/logo-white.png"
                alt=""
                width={16}
                height={16}
                className="object-contain"
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
