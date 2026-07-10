"use client"

import { aboutData } from "@/lib/data/about"
import "@/lib/GSAPAnimations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)
  const statsCardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Title/description start muted and reveal word-by-word as the
      // section is scrolled through, rather than fading in all at once.
      ;[titleRef.current, descRef.current].forEach((el) => {
        if (!el) return
        const split = SplitText.create(el, { type: "words" })

        gsap.set(split.words, { opacity: 0.25 })
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        })
      })

      // Globe drifts sideways as the card scrolls through the viewport.
      if (globeRef.current) {
        gsap.fromTo(
          globeRef.current,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: globeRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      }

      // Count the stats up once the stats card enters view.
      if (statsCardRef.current) {
        const values = gsap.utils.toArray<HTMLElement>(
          "[data-stat-value]",
          statsCardRef.current
        )

        ScrollTrigger.create({
          trigger: statsCardRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            values.forEach((el) => {
              const target = Number(el.dataset.statValue)
              const counter = { value: 0 }
              gsap.to(counter, {
                value: target,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = Math.round(counter.value).toString()
                },
              })
            })
          },
        })
      }

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    },
    { scope: sectionRef }
  )

  return (
    <section id="company" ref={sectionRef} className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex items-center gap-2 text-xs font-medium tracking-widest text-white/60 uppercase">
          <span className="size-1.5 rounded-full bg-white" />
          {aboutData.eyebrow}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 p-8">
            <h3 className="text-xl font-medium text-white sm:text-2xl">
              {aboutData.card.title}
            </h3>

            <Link
              href={aboutData.card.cta.href}
              className="mt-6 w-fit rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              data-cursor="magnetic"
            >
              {aboutData.card.cta.text}
            </Link>

            <div className="relative mt-10 aspect-square overflow-hidden rounded-2xl">
              <div ref={globeRef} className="absolute -inset-x-10 inset-y-0">
                <Image
                  src={aboutData.card.image}
                  alt=""
                  fill
                  className="object-cover object-bottom"
                />
              </div>
            </div>
          </div>

          <div>
            <h2
              ref={titleRef}
              className="max-w-3xl text-3xl leading-tight font-light tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
            >
              {aboutData.title}
            </h2>

            <p
              ref={descRef}
              className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
            >
              {aboutData.description}
            </p>

            <div
              ref={statsCardRef}
              className="mt-10 rounded-3xl border border-white/10 bg-neutral-900 p-8 sm:p-10"
            >
              <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                {aboutData.statsCard.trustLine}
              </p>

              <div className="mt-10 flex flex-wrap items-end justify-between gap-10">
                <div className="flex flex-wrap gap-10">
                  {aboutData.stats.map((stat) => (
                    <div key={stat.title}>
                      <p className="text-4xl font-medium text-white sm:text-5xl">
                        <span data-stat-value={stat.value}>0</span>
                        {stat.highlight}
                      </p>
                      <p className="mt-2 text-xs text-white/50 sm:text-sm">
                        {stat.title}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-white/80">
                  <div className="flex" aria-hidden="true">
                    {Array.from({
                      length: aboutData.statsCard.review.rating,
                    }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {aboutData.statsCard.review.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
