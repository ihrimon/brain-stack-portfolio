"use client"

import type { ServiceSpotlightData } from "@/lib/data/service-page"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import { useRef, useState } from "react"

interface ServiceSpotlightProps {
  spotlight: ServiceSpotlightData
}

export default function ServiceSpotlight({ spotlight }: ServiceSpotlightProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const current = spotlight[index]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          contentRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" }
        )
      })
      return () => mm.revert()
    },
    { dependencies: [index], scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <h1 className="rise-up max-w-[10.7em] text-[clamp(2.75rem,7vw,7.5rem)] leading-[0.92] font-medium tracking-[-0.05em] text-ink uppercase">
          {current.title}
        </h1>

        <div
          role="tablist"
          aria-label="Service spotlight"
          className="mt-10 flex flex-wrap gap-2 border-b border-line pb-8"
        >
          {spotlight.map((item, itemIndex) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
              data-cursor="magnetic"
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition-colors duration-300",
                itemIndex === index
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-2 hover:border-ink hover:text-ink"
              )}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div ref={contentRef} className="grid gap-12 pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <div className="flex flex-col justify-center lg:col-span-5">
            <h2 className="max-w-md text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-ink sm:text-4xl">
              {current.subtitle}
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-ink-2 sm:text-lg">
              {current.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] tracking-wide text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-3/2 overflow-hidden rounded-3xl bg-paper-2 lg:col-span-6 lg:col-start-7">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
