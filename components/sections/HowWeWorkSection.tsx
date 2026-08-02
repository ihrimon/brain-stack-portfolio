"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
import "@/lib/animations/gsap-animations"
import type { ProcessData } from "@/lib/data/process"
import { cn } from "@/lib/utils/cn"
import { resolveIcon } from "@/lib/utils/icons"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useCallback, useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

interface HowWeWorkSectionProps {
  data: ProcessData
}

interface Connector {
  dot: { x: number; y: number }
  line: string
  arrow: string
}

// Gap kept between the dot/arrow and the card edges they connect, so the
// line is measurably outside both cards rather than guessed via fixed CSS
// offsets (which drifted out of sync whenever card height changed).
const EDGE_GAP = 16
const CORNER_RADIUS = 14

export default function HowWeWorkSection({ data }: HowWeWorkSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const cardElsRef = useRef<(HTMLDivElement | null)[]>([])
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 })
  const [connectors, setConnectors] = useState<Connector[]>([])

  // Reads each card's actual rendered position and draws every connector
  // from the vertical center of the source card's outer edge straight to
  // the target card's top-center — computed from real layout instead of
  // hardcoded offsets, so the line always lands outside both cards
  // regardless of how tall their content makes them.
  const measure = useCallback(() => {
    const container = cardsRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    setOverlaySize({ width: containerRect.width, height: containerRect.height })

    const cardRects = cardElsRef.current.map((el) => el?.getBoundingClientRect())

    const next: Connector[] = []
    for (let i = 0; i < cardRects.length - 1; i++) {
      const a = cardRects[i]
      const b = cardRects[i + 1]
      if (!a || !b) continue

      const sourceAlignEnd = i % 2 === 1
      const startX =
        (sourceAlignEnd ? a.left - EDGE_GAP : a.right + EDGE_GAP) - containerRect.left
      const startY = (a.top + a.bottom) / 2 - containerRect.top
      const endX = (b.left + b.right) / 2 - containerRect.left
      const endY = b.top - containerRect.top

      const goingRight = endX > startX
      const turnX = goingRight ? endX - CORNER_RADIUS : endX + CORNER_RADIUS
      const turnY = startY + CORNER_RADIUS
      const arrowY = Math.max(endY - 10, turnY + 4)

      next.push({
        dot: { x: startX, y: startY },
        line: `M ${startX} ${startY} H ${turnX} Q ${endX} ${startY} ${endX} ${turnY} V ${arrowY}`,
        arrow: `M ${endX - 6} ${arrowY} L ${endX} ${endY} L ${endX + 6} ${arrowY}`,
      })
    }
    setConnectors(next)
  }, [])

  useEffect(() => {
    measure()

    const container = cardsRef.current
    if (!container || typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(() => measure())
    observer.observe(container)
    window.addEventListener("resize", measure)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [measure])

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])

      if (!cardsRef.current) return

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-process-card]",
        cardsRef.current
      )
      const cleanups: (() => void)[] = []

      // Cards reveal by sliding up from just below into their exact
      // resting position the first time they scroll into view.
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
            // Card position settles once the entrance tween finishes —
            // re-measure so connectors line back up with it.
            onComplete: measure,
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
    { scope: sectionRef, dependencies: [measure] }
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
            one's top flush against the previous card's bottom, connected
            by a dashed elbow arrow — inspired by a reference "research →
            design → build → deliver" flow diagram. */}
        <div ref={cardsRef} className="relative mx-auto mt-20 flex max-w-6xl flex-col">
          {data.items.map((item, index) => {
            const Icon = resolveIcon(item.icon)
            const alignEnd = index % 2 === 1

            return (
              <div
                key={item.title}
                className={cn(
                  "relative w-full lg:w-[46%]",
                  alignEnd && "lg:self-end",
                  index > 0 && "mt-10 lg:mt-0"
                )}
              >
                <div
                  ref={(el) => {
                    cardElsRef.current[index] = el
                  }}
                  data-process-card
                  className="relative z-10 overflow-hidden rounded-3xl bg-surface-dark p-6 shadow-xl sm:p-8 lg:min-h-56"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="text-xl font-medium text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    <span className="ml-auto shrink-0 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
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
            )
          })}

          {/* Connector overlay — a single SVG sized to the card stack and
              positioned above it, drawn from measured card positions (see
              `measure`) so every line starts and ends outside the card
              rectangles it connects, no matter their rendered height. */}
          <svg
            aria-hidden="true"
            width={overlaySize.width}
            height={overlaySize.height}
            className="pointer-events-none absolute inset-0 z-20 hidden text-primary/60 lg:block"
          >
            {connectors.map((connector, index) => (
              <g key={index}>
                <circle cx={connector.dot.x} cy={connector.dot.y} r={4} fill="currentColor" />
                <path
                  d={connector.line}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
                <path
                  d={connector.arrow}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
