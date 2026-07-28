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

// Cycled per-step for the colored side tab — same accent trio used
// elsewhere, just repurposed from a corner dot to the step tab.
const tabAccentClasses = ["bg-brand-primary", "bg-brand-secondary", "bg-brand-accent"]

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
      // scroll into view — matches the alternating left/right staircase
      // layout below.
      cards.forEach((card, index) => {
        const from = index % 2 === 0 ? { x: -60, y: 0 } : { x: 60, y: 0 }

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
          gsap.to(card, { y: -8, duration: 0.45, ease: "power3.out" })
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
      // above.
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
      <div className="relative mx-auto max-w-400 px-5 sm:px-8">
        <HeadingSection
          badge={data.badge}
          title={data.title}
          titleRef={titleRef}
          link={{ label: "Let's Work Together", href: "/contact" }}
        />

        {/* Staircase flow: steps alternate left/right down the page, each
            one starting halfway down the previous one (50% overlap) and
            connected to it by a dashed elbow arrow — inspired by a
            reference "research → design → build → deliver" flow diagram. */}
        <div ref={cardsRef} className="mx-auto mt-20 flex max-w-6xl flex-col">
          {data.items.map((item, index) => {
            const Icon = resolveIcon(item.icon)
            const isLast = index === data.items.length - 1
            const alignEnd = index % 2 === 1

            return (
              <div
                key={item.title}
                className={cn(
                  "relative w-full lg:w-[46%]",
                  alignEnd && "lg:self-end",
                  index > 0 && "mt-10 lg:-mt-28"
                )}
              >
                <div
                  data-process-card
                  className="relative z-10 flex overflow-hidden rounded-3xl bg-surface-dark shadow-xl lg:min-h-56"
                >
                  {/* Step-number side tab */}
                  <div
                    className={cn(
                      "flex w-12 shrink-0 items-center justify-center py-6 sm:w-14",
                      tabAccentClasses[index % tabAccentClasses.length]
                    )}
                  >
                    <span className="[writing-mode:vertical-rl] text-xs font-semibold tracking-widest text-white sm:text-sm">
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex-1 p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                        <Icon className="size-4" />
                      </span>
                      <h3 className="text-xl font-medium text-white sm:text-2xl">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                      {item.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
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
                </div>

                {/* Dashed connector reaching toward the next step — a small
                    node dot where it leaves this card, a dashed elbow, and
                    an arrowhead where it meets the next one. */}
                {!isLast && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 140"
                    preserveAspectRatio="none"
                    className={cn(
                      "pointer-events-none absolute bottom-6 z-20 hidden h-36 w-32 text-primary/60 lg:block",
                      alignEnd ? "left-2 -scale-x-100" : "right-2"
                    )}
                  >
                    <circle cx="8" cy="8" r="4" fill="currentColor" />
                    <path
                      d="M8 12 V80 Q8 100 28 100 H100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />
                    <path
                      d="M100 100 L91 93 M100 100 L91 107"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
