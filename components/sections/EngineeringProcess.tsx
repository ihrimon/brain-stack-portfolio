"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
import "@/lib/animations/gsap-animations"
import type { ProcessData } from "@/lib/data/home-page"
import { cn } from "@/lib/utils/cn"
import { resolveIcon } from "@/lib/utils/icons"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

const accentClasses = [
  "bg-brand-secondary",
  "bg-brand-accent",
  "bg-brand-primary",
]

interface EngineeringProcessProps {
  data: ProcessData
}

export default function EngineeringProcess({ data }: EngineeringProcessProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])

      if (!cardsRef.current) return

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-process-card]",
        cardsRef.current
      )
      const cleanups: (() => void)[] = []

      // Cards fade/slide in, alternating left/right by position, as they
      // scroll into view — a layout-agnostic version of the previous
      // fixed 3-card left/bottom/right stagger, since the grid now wraps
      // to a variable number of rows depending on viewport width.
      cards.forEach((card, index) => {
        const from = index % 2 === 0 ? { x: -80, y: 0 } : { x: 80, y: 0 }

        gsap.fromTo(
          card,
          { opacity: 0, x: from.x, y: from.y },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        )

        // Same GSAP-driven, smoothly-animated position shift as
        // PrimaryButton's hover swap — the card itself moves on hover
        // instead of relying on a plain CSS transition.
        const onEnter = () =>
          gsap.to(card, { y: -10, duration: 0.45, ease: "power3.out" })
        const onLeave = () =>
          gsap.to(card, { y: 0, duration: 0.45, ease: "power3.out" })

        card.addEventListener("mouseenter", onEnter)
        card.addEventListener("mouseleave", onLeave)
        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter)
          card.removeEventListener("mouseleave", onLeave)
        })
      })

      // Only the manual mouseenter/mouseleave listeners need explicit
      // cleanup here — useGSAP's automatic gsap.context().revert() (scoped
      // to sectionRef) already tears down every tween/ScrollTrigger created
      // above. A prior version of this also called
      // `ScrollTrigger.getAll().forEach(t => t.kill())`, which kills every
      // ScrollTrigger on the page, not just this component's own.
      return () => {
        cleanups.forEach((fn) => fn())
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-dark py-20 sm:py-28"
    >
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden h-64 w-64 opacity-40 sm:block"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      /> */}
      {/* <span
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-13 hidden size-2 rounded-full bg-brand-accent sm:block"
      /> */}

      <div className="relative mx-auto max-w-400 px-5 sm:px-8">
        <HeadingSection
          badge={data.badge}
          title={data.title}
          titleRef={titleRef}
          link={{ label: "Let's Work Together", href: "/contact" }}
        />

        <div className="relative mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-16 top-28 hidden border-t border-dashed border-white/15 lg:block"
          >
            <span className="absolute top-0 left-1/3 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
            <span className="absolute top-0 left-2/3 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
          </div>

          <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {data.items.map((item, index) => {
              const Icon = resolveIcon(item.icon)

              return (
                <div
                  key={item.title}
                  data-process-card
                  className="relative overflow-hidden rounded-2xl bg-neutral-900 p-8"
                >
                  <div
                    aria-hidden="true"
                    className="absolute top-6 right-6 grid grid-cols-3 grid-rows-2 gap-1 opacity-90"
                  >
                    <span
                      className={cn(
                        "col-start-2 row-start-1 size-3 rounded-[3px]",
                        accentClasses[index % accentClasses.length]
                      )}
                    />
                    <span
                      className={cn(
                        "col-start-3 row-start-1 size-3 rounded-[3px]",
                        accentClasses[index % accentClasses.length]
                      )}
                    />
                    <span
                      className={cn(
                        "col-start-1 row-start-2 size-3 rounded-[3px]",
                        accentClasses[index % accentClasses.length]
                      )}
                    />
                    <span
                      className={cn(
                        "col-start-2 row-start-2 size-3 rounded-[3px]",
                        accentClasses[index % accentClasses.length]
                      )}
                    />
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white">
                    <Icon className="size-3.5" />
                    STEP : {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-6 text-2xl font-medium text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                    {item.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
