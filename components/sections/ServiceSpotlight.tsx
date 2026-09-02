"use client"

import type { ServiceSpotlightData } from "@/lib/data/service-page"
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
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      )
    },
    { dependencies: [index], scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="bg-brand-dark pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <h1 className="max-w-3xl text-4xl leading-[0.95] font-medium tracking-tight text-white uppercase sm:text-6xl md:text-6xl">
          {current.title}
        </h1>

        <div
          role="tablist"
          aria-label="Service spotlight"
          className="mt-8 flex flex-wrap gap-3"
        >
          {spotlight.map((item, itemIndex) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
              data-cursor="magnetic"
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                itemIndex === index
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 sm:mt-10" />

        <div
          ref={contentRef}
          className="grid gap-10 pt-16 lg:grid-cols-[1fr_1px_1fr] lg:gap-16"
        >
          <div className="flex flex-col justify-center">
            <h2 className="max-w-md text-3xl leading-tight font-medium text-white sm:text-4xl">
              {current.subtitle}
            </h2>

            <p className="mt-8 max-w-md text-base leading-relaxed text-white/60">
              {current.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div aria-hidden="true" className="hidden bg-white/10 lg:block" />

          <div className="relative aspect-3/2 overflow-hidden rounded-3xl bg-surface-dark">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
