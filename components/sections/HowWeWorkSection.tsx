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
  /** Where the arrow lands on the target card's top edge. */
  end: { x: number; y: number }
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

    // Measure each card's wrapper, not the card: the card itself is moved
    // and scaled by the reveal animation, its wrapper never is.
    const cardRects = cardElsRef.current.map((el) =>
      el?.parentElement?.getBoundingClientRect()
    )

    const next: Connector[] = []
    for (let i = 0; i < cardRects.length - 1; i++) {
      const a = cardRects[i]
      const b = cardRects[i + 1]
      if (!a || !b) continue

      const sourceAlignEnd = i % 2 === 1
      const startX =
        (sourceAlignEnd ? a.left - EDGE_GAP : a.right + EDGE_GAP) -
        containerRect.left
      const startY = (a.top + a.bottom) / 2 - containerRect.top
      const endX = (b.left + b.right) / 2 - containerRect.left
      const endY = b.top - containerRect.top

      const goingRight = endX > startX
      const turnX = goingRight ? endX - CORNER_RADIUS : endX + CORNER_RADIUS
      const turnY = startY + CORNER_RADIUS
      const arrowY = Math.max(endY - 10, turnY + 4)

      next.push({
        dot: { x: startX, y: startY },
        end: { x: endX, y: endY },
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

  // Scroll-driven node-to-node flow — no pinning, the page scrolls normally.
  //
  // Desktop (`lg`+): one timeline scrubbed across the card stack's own
  // scroll distance plays card 1 → line 1 → card 2 → line 2 → card 3 →
  // line 3 → card 4, so each step happens as it passes through the view.
  // Once card 4 is in, the page simply continues to the next section.
  // Scrolling back up runs the same timeline backwards: cards hide and
  // lines retract into their source nodes, last to first. A faint dashed
  // track always marks each line's path.
  //
  // Below `lg` (no connectors): each card reveals as it scrolls in (and
  // hides again when scrolled back above it).
  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])

      const container = cardsRef.current
      if (!container) return
      const cards = cardElsRef.current.filter((el): el is HTMLDivElement => !!el)
      const wrappers = cards.map((card) => card.parentElement as HTMLElement)
      const groups = gsap.utils.toArray<SVGGElement>("[data-flow]", container)
      const lines = groups.map((g) => g.querySelector("[data-flow-line]"))
      const heads = groups.map((g) => g.querySelector("[data-flow-head]"))

      const HIDDEN = { autoAlpha: 0, y: 40, scale: 0.97 }
      const SHOWN = { autoAlpha: 1, y: 0, scale: 1 }

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, SHOWN)
        gsap.set(lines, { strokeDashoffset: 0 })
        gsap.set(heads, { opacity: 1 })
      })

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        if (lines.length === 0) return
        gsap.set(cards, HIDDEN)
        gsap.set(lines, { strokeDashoffset: 1 })
        gsap.set(heads, { opacity: 0 })

        // Relative durations: lines get a little more scroll than cards so
        // the connection reads as a flow rather than a blink.
        const CARD = 1
        const LINE = 1.4

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: container,
            // Card 1 starts as the stack enters the lower part of the view;
            // card 4 lands while it's still comfortably on screen.
            start: "top 80%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        })

        let t = 0
        cards.forEach((card, i) => {
          tl.to(card, { ...SHOWN, duration: CARD, ease: "power2.out" }, t)
          t += CARD
          if (lines[i]) {
            tl.to(lines[i], { strokeDashoffset: 0, duration: LINE, ease: "power1.inOut" }, t)
            tl.to(heads[i], { opacity: 1, duration: 0.2 }, t + LINE - 0.2)
            t += LINE
          }
        })
      })

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card, i) => {
          gsap.fromTo(card, HIDDEN, {
            ...SHOWN,
            ease: "power2.out",
            scrollTrigger: { trigger: wrappers[i], start: "top 90%", end: "top 65%", scrub: 0.6 },
          })
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [connectors.length] }
  )

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <div className="relative mx-auto max-w-site px-4 lg:px-6">
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
        <div
          ref={cardsRef}
          className="relative mx-auto mt-20 flex max-w-6xl flex-col"
        >
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
                  className="relative z-10 overflow-hidden rounded-2xl bg-paper-2 p-6 sm:p-8 lg:min-h-56"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
                      {item.title}
                    </h3>
                    <span className="ml-auto shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-wider text-ink-2">
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {item.duration && (
                    <p className="mt-3 font-mono text-[11px] tracking-wider text-signal-text uppercase">
                      {item.duration}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-relaxed text-ink-2 sm:text-base">
                    {item.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-2"
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
              rectangles it connects, no matter their rendered height.
              Each connector: faint dashed track, scroll-drawn line, source
              node and arrowhead. */}
          <svg
            aria-hidden="true"
            width={overlaySize.width}
            height={overlaySize.height}
            className="pointer-events-none absolute inset-0 z-20 hidden overflow-visible lg:block"
          >
            {connectors.map((connector, index) => (
              <g key={index} data-flow>
                {/* Track */}
                <path
                  d={connector.line}
                  fill="none"
                  stroke="var(--signal)"
                  strokeOpacity="0.22"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
                {/* Line (drawn in and retracted by scroll) */}
                <path
                  data-flow-line
                  d={connector.line}
                  pathLength={1}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="1"
                  strokeDashoffset={1}
                />
                {/* Source node */}
                <circle
                  cx={connector.dot.x}
                  cy={connector.dot.y}
                  r={4.5}
                  fill="var(--signal)"
                />
                {/* Arrowhead */}
                <path
                  data-flow-head
                  d={connector.arrow}
                  opacity={0}
                  stroke="var(--signal)"
                  strokeWidth="2"
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
