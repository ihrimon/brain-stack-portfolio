"use client"

import { aboutData } from "@/lib/data/about"
import "@/lib/GSAPAnimations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
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
    <section
      id="company"
      ref={sectionRef}
      className="bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <span className="mb-10 w-fit rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm">
          {aboutData.eyebrow}
        </span>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,400px)_1fr]">
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
            <div className="space-y-6 p-8">
              <h3 className="text-2xl font-medium text-white sm:text-4xl">
                {aboutData.card.title}
              </h3>

              <Link
                href={aboutData.card.cta.href}
                className="mt-6 w-fit rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                data-cursor="magnetic"
              >
                {aboutData.card.cta.text}
              </Link>
            </div>

            <div className="relative mt-10 aspect-square overflow-hidden rounded-2xl p-0">
              <div ref={globeRef} className="absolute -inset-x-10 inset-y-0">
                <Image
                  src={aboutData.card.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
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

              <div className="flex flex-wrap items-end justify-between gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {aboutData.stats.map((stat) => (
                    <div key={stat.title}>
                      <div className='flex items-center gap-4'>
                        <p className="text-2xl font-medium text-white sm:text-4xl">
                          <span data-stat-value={stat.value}>0</span>
                          {stat.highlight}
                        </p>
                        <p className="mt-2 text-lg text-white/50 uppercase tracking-wide">
                          {stat.title}
                        </p>
                      </div>
                      <p className='mt-4 text-white/70'>{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
