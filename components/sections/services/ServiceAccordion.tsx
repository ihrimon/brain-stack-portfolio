"use client"

import "@/lib/animations/gsap-animations"
import { SCROLL_TO_TOP_EVENT } from "@/components/common/ScrollButton"
import { getLenis } from "@/lib/animations/lenis"
import type { ServiceOffering } from "@/lib/data/shared-types"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import {
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  Headset,
  MonitorSmartphone,
  Rocket,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useId, useRef, useState, type CSSProperties } from "react"

// One icon per service (keyed by slug), used both as the small chip in each
// row and as the large emblem in the open row.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "app-design-development": Smartphone,
  "web-design-development": MonitorSmartphone,
  "ai-autonomous-agents": BrainCircuit,
  "rapid-mvp-development": Rocket,
  "enterprise-pos-erp-saas": Boxes,
  "business-operations-management": Headset,
}

interface ServiceAccordionProps {
  items: readonly ServiceOffering[]
}

/**
 * Cuberto-style service list: a stack of large rounded rows. One row is
 * open at a time — it inverts (ink fill, paper text), expands like an
 * accordion (grid rows 0fr → 1fr) to reveal the service's deliverables and
 * its "Explore" link, and shows a large animated service emblem on the
 * right. Scrolling opens the rows one at a time (see the effect below);
 * clicking or keyboard-activating a header also opens it. Rows fade up in sequence on scroll.
 */
export function ServiceAccordion({ items }: ServiceAccordionProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeRef = useRef(-1)
  /** Opens row i from a header click (scrolls to it while locked). */
  const controlRef = useRef<(i: number) => void>(() => {})
  // -1 = none open (the list hasn't reached the middle of the screen yet).
  const [active, setActive] = useState(-1)
  const idPrefix = useId()

  // Scroll decides which row is open, one row per scroll gesture.
  //
  // Free scrolling until row 1's header reaches the middle of the screen;
  // then the page locks and each wheel / swipe / arrow-key gesture moves
  // exactly one row (1 → 2 → … → 6), smoothly scrolling the newly opened
  // row's header to the middle. A further gesture down past row 6 releases
  // the lock and the page carries on to the next section. Coming back up,
  // the lock engages again at row 6 and steps 6 → 5 → … → 1; one more
  // gesture up closes everything and releases. A fast flick can't skip it:
  // jumping over the whole list in one frame still locks at the edge it
  // came from. Without Lenis (reduced motion) it falls back to simply
  // opening the last row whose header has passed the middle.
  useEffect(() => {
    const STEP_MS = 900
    const n = items.length
    let mode: "free" | "locked" | "releasing" = "free"
    let busyUntil = 0
    let frame = 0
    let touchY: number | null = null
    // Set by the back-to-top button: ignore the list while the page flies
    // past it to the top.
    let suspendedUntil = 0

    const headers = () => headerRefs.current
    const mid = () => window.innerHeight / 2
    const centerOf = (i: number) => {
      const r = headers()[i]?.getBoundingClientRect()
      return r ? r.top + r.height / 2 : Infinity
    }
    const zone = (): "above" | "inside" | "below" => {
      if (centerOf(0) > mid() + 1) return "above"
      if (centerOf(n - 1) < mid() - 1) return "below"
      return "inside"
    }
    const indexAtMiddle = () => {
      let next = -1
      for (let i = 0; i < n; i++) if (centerOf(i) <= mid() + 1) next = i
      return next
    }
    const setOpen = (i: number) => {
      activeRef.current = i
      setActive(i)
    }

    // Scroll target that centers row i's header once the transition ends:
    // if the row closing now sits above row i, its body collapses and pulls
    // row i up by that body's height.
    const targetFor = (i: number) => {
      const from = activeRef.current
      let shift = 0
      if (from >= 0 && from < i) {
        shift = panelRefs.current[from]?.getBoundingClientRect().height ?? 0
      }
      return window.scrollY + centerOf(i) - mid() - shift
    }

    const goTo = (i: number) => {
      const lenis = getLenis()
      const target = targetFor(i)
      setOpen(i)
      busyUntil = performance.now() + STEP_MS
      lenis?.scrollTo(target, { duration: 1, force: true })
    }

    const lock = (i: number) => {
      const lenis = getLenis()
      if (!lenis) return
      mode = "locked"
      lenis.stop()
      goTo(i)
    }

    const release = (dir: 1 | -1) => {
      const lenis = getLenis()
      if (!lenis) return
      mode = "releasing"
      if (dir === -1) setOpen(-1)
      lenis.scrollTo(window.scrollY + dir * window.innerHeight * 0.35, {
        duration: 0.7,
        force: true,
        onComplete: () => {
          mode = "free"
          lastZone = zone()
          lenis.start()
        },
      })
    }

    const step = (dir: 1 | -1) => {
      if (performance.now() < busyUntil) return
      const next = activeRef.current + dir
      if (next >= n) release(1)
      else if (next < 0) release(-1)
      else goTo(next)
    }
    controlRef.current = (i: number) => {
      if (mode === "locked") goTo(i)
      else setOpen(i)
    }

    let lastZone = zone()
    const check = () => {
      frame = 0
      if (mode !== "free") return
      if (performance.now() < suspendedUntil) {
        lastZone = zone()
        return
      }
      const now = zone()
      const prev = lastZone
      lastZone = now
      const lenis = getLenis()
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      // The lock only ever engages on the way *down*, at the moment row 1
      // reaches the middle of the screen — i.e. only once the visitor is
      // actually in the section. Nothing pulls the page back: scrolling up
      // from below (or a flick that carries the page past the list) just
      // opens/closes rows by position, like normal scrolling.
      if (lenis && !reduced && prev === "above" && now === "inside") {
        lock(0)
        return
      }
      const next = indexAtMiddle()
      if (next !== activeRef.current) setOpen(next)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }

    // One gesture = one step. A trackpad flick keeps firing decaying wheel
    // events (inertia) for a second or more, so a step is only taken at the
    // start of a new gesture: after a short pause in the event stream, or
    // when the delta jumps up again (a fresh push).
    let lastWheelAt = 0
    let lastWheelAbs = 0
    const onWheel = (e: WheelEvent) => {
      if (mode === "free") return
      e.preventDefault()
      const now = performance.now()
      const abs = Math.abs(e.deltaY)
      const fresh = now - lastWheelAt > 160 || abs > lastWheelAbs + 20
      lastWheelAt = now
      lastWheelAbs = abs
      if (mode === "locked" && fresh && abs > 2) step(e.deltaY > 0 ? 1 : -1)
    }
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null
    }
    const onTouchMove = (e: TouchEvent) => {
      if (mode === "free") return
      e.preventDefault()
      const y = e.touches[0]?.clientY
      if (mode !== "locked" || touchY === null || y === undefined) return
      const dy = touchY - y
      if (Math.abs(dy) > 40) {
        step(dy > 0 ? 1 : -1)
        touchY = y
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (mode === "free") return
      const down = ["ArrowDown", "PageDown", " "].includes(e.key)
      const up = ["ArrowUp", "PageUp"].includes(e.key)
      if (!down && !up) return
      e.preventDefault()
      if (mode === "locked") step(down ? 1 : -1)
    }

    check()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("keydown", onKey)
    const onScrollToTop = () => {
      suspendedUntil = performance.now() + 2500
      if (mode !== "free") {
        mode = "free"
        getLenis()?.start()
      }
      setOpen(-1)
    }
    window.addEventListener(SCROLL_TO_TOP_EVENT, onScrollToTop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(SCROLL_TO_TOP_EVENT, onScrollToTop)
      if (mode !== "free") getLenis()?.start()
    }
  }, [items.length])

  useGSAP(
    () => {
      gsap.effects.staggerFadeUpOnScroll(listRef.current, {
        childSelector: "[data-service-item]",
      })
    },
    { scope: listRef }
  )

  return (
    <div
      ref={listRef}
      className="mx-auto grid max-w-site gap-3 px-4 sm:gap-4 lg:px-6"
    >
      {items.map((item, index) => {
        const isOpen = index === active
        const Icon = SERVICE_ICONS[item.slug ?? ""] ?? Sparkles
        const headerId = `${idPrefix}-svc-${index}`
        const panelId = `${idPrefix}-svc-panel-${index}`
        const number = item.id ?? String(index + 1).padStart(2, "0")

        return (
          <article
            key={item.slug ?? item.title}
            data-service-item
            className={cn(
              "group relative isolate overflow-hidden rounded-[2rem] transition-colors duration-500",
              isOpen ? "text-paper" : "text-ink"
            )}
          >
            {/* Fill: paper-2 at rest, inverts to ink when open. */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 -z-10 rounded-[inherit] transition-colors duration-700 ease-premium",
                isOpen ? "bg-ink" : "bg-paper-2 group-hover:bg-ink/[0.06]"
              )}
            />

            {/* Emblem: large service icon inside slowly turning rings. */}
            <ServiceEmblem Icon={Icon} open={isOpen} />

            <h3>
              <button
                type="button"
                ref={(el) => {
                  headerRefs.current[index] = el
                }}
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => controlRef.current(index)}
                className="flex w-full cursor-pointer items-center gap-4 px-6 py-6 text-left sm:gap-6 sm:px-10 sm:py-8 lg:px-14"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 sm:size-14",
                    isOpen
                      ? "bg-signal text-signal-ink"
                      : "bg-signal/10 text-signal"
                  )}
                >
                  <Icon className="size-5 sm:size-6" strokeWidth={1.6} />
                </span>

                <span className="min-w-0 flex-1 text-[clamp(1.25rem,1.9vw,1.875rem)] leading-[1.1] font-medium tracking-[-0.03em]">
                  {item.title}
                </span>

                <span
                  className={cn(
                    "hidden font-mono text-sm tracking-wider transition-opacity duration-300 sm:block",
                    isOpen ? "opacity-60" : "opacity-30"
                  )}
                >
                  {number}
                </span>
              </button>
            </h3>

            {/* Accordion body (Cuberto's 1.2s expo-out grid-rows easing). */}
            <div
              ref={(el) => {
                panelRefs.current[index] = el
              }}
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "px-6 pb-8 transition-opacity sm:px-10 sm:pb-10 md:pr-[clamp(16rem,34%,26rem)] lg:px-14 lg:pb-14",
                    isOpen
                      ? "opacity-100 duration-700"
                      : "opacity-0 duration-200"
                  )}
                >
                  {item.items && item.items.length > 0 && (
                    <ul className="flex max-w-2xl flex-wrap gap-2 sm:ml-20">
                      {item.items.map((deliverable, k) => (
                        <li
                          key={deliverable}
                          className={cn(
                            "rounded-full border border-paper/20 px-3.5 py-1.5 text-sm text-paper/85",
                            isOpen && "service-chip"
                          )}
                          style={{ "--k": k } as CSSProperties}
                        >
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.buttonLabel && item.buttonHref && (
                    <Link
                      href={item.buttonHref}
                      className="group/btn mt-8 inline-flex h-12 items-center gap-2.5 rounded-full bg-paper pr-2 pl-6 text-sm font-medium text-ink transition-colors duration-500 hover:bg-signal hover:text-signal-ink sm:ml-20"
                    >
                      <span className="relative inline-flex overflow-hidden">
                        <span className="block transition-transform duration-500 ease-premium group-hover/btn:-translate-y-full">
                          {item.buttonLabel}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-premium group-hover/btn:translate-y-0"
                        >
                          {item.buttonLabel}
                        </span>
                      </span>
                      <span className="flex size-8 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 ease-premium group-hover/btn:rotate-45">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/**
 * The open row's visual: the service icon, large, centered in three
 * concentric rings — two slowly counter-rotating dashed rings and a solid
 * one with a signal "satellite" orbiting it — over a soft signal glow.
 * Scales/fades in when the row opens. Hidden on small screens.
 */
function ServiceEmblem({ Icon, open }: { Icon: LucideIcon; open: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-[clamp(4.5rem,9%,8rem)] bottom-[clamp(1.5rem,8%,3.5rem)] hidden size-[clamp(11rem,22vw,17rem)] transition-[opacity,scale,rotate] duration-1000 ease-[cubic-bezier(.16,1,.3,1)] md:block",
        open
          ? "scale-100 rotate-0 opacity-100"
          : "scale-75 -rotate-12 opacity-0"
      )}
    >
      <div className="absolute inset-[18%] rounded-full bg-signal/30 blur-2xl" />
      <div className="service-ring-cw absolute inset-0 rounded-full border border-dashed border-paper/25" />
      <div className="service-ring-ccw absolute inset-[12%] rounded-full border border-dashed border-paper/20" />
      <div className="service-ring-cw-slow absolute inset-[24%] rounded-full border border-paper/30">
        <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-signal shadow-[0_0_12px] shadow-signal" />
      </div>
      <div className="absolute inset-[34%] flex items-center justify-center rounded-[28%] bg-signal text-signal-ink shadow-[0_20px_60px_-15px] shadow-signal/60">
        <Icon className="size-1/2" strokeWidth={1.4} />
      </div>
    </div>
  )
}
