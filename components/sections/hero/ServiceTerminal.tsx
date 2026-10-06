"use client"

import type { ServiceOffering } from "@/lib/data/shared-types"
import { cn } from "@/lib/utils/cn"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const TYPE_MS = 24
const STEP_MS = 360
const HOLD_MS = 2600
/** The first service is server-rendered already finished; animation only
 * begins after this pause, so nothing churns while the page is loading. */
const FIRST_HOLD_MS = 5000
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

interface ServiceTerminalProps {
  services: readonly ServiceOffering[]
  className?: string
}

/**
 * The hero's interactive terminal (x.ai-style "show the product"), driven
 * entirely by the real services data: for the active service it types a
 * `ship` command, then resolves each of that service's deliverables one by
 * one, and finally offers its own "Explore Service" link. It then moves on
 * to the next service by itself.
 *
 * - The numbered tabs switch service on demand (and restart the run).
 * - Hovering or focusing the card pauses the auto-advance.
 * - Reduced-motion visitors get each service fully resolved, no autoplay.
 *
 * Plain React state + timers, no animation library.
 */
export function ServiceTerminal({ services, className }: ServiceTerminalProps) {
  const [active, setActive] = useState(0)
  // Start fully resolved (first service), so the first paint is final
  // content rather than an empty terminal mid-animation.
  const [typed, setTyped] = useState(
    () => `brainstack ship --service ${services[0].slug ?? services[0].id ?? "1"}`.length
  )
  const [resolved, setResolved] = useState(() => services[0].items?.length ?? 0)
  const firstRun = useRef(true)
  const [spin, setSpin] = useState(0)
  const pausedRef = useRef(false)

  const service = services[active]
  const slug = service.slug ?? service.id ?? String(active + 1)
  const command = `brainstack ship --service ${slug}`
  const items = service.items ?? []
  const typing = typed < command.length
  const done = !typing && resolved >= items.length

  // One run per active service: type the command, then resolve each item,
  // then hold and advance (unless paused or reduced motion).
  useEffect(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const advance = () => {
      if (pausedRef.current) at(500, advance)
      else setActive((current) => (current + 1) % services.length)
    }

    // Mount: the first service is already shown complete — just hold, then
    // move on and start animating from the second service.
    if (firstRun.current) {
      firstRun.current = false
      if (!reduced) at(FIRST_HOLD_MS, advance)
      return () => timers.forEach(window.clearTimeout)
    }

    at(0, () => {
      setTyped(reduced ? command.length : 0)
      setResolved(reduced ? items.length : 0)
    })
    if (reduced) return () => timers.forEach(window.clearTimeout)

    for (let i = 1; i <= command.length; i++) at(200 + i * TYPE_MS, () => setTyped(i))
    const stepsStart = 200 + command.length * TYPE_MS + 250
    for (let i = 1; i <= items.length; i++) at(stepsStart + i * STEP_MS, () => setResolved(i))

    at(stepsStart + items.length * STEP_MS + HOLD_MS, advance)

    return () => timers.forEach(window.clearTimeout)
  }, [active, command.length, items.length, services.length])

  // Braille spinner for the line currently "running".
  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => setSpin((s) => (s + 1) % SPINNER.length), 80)
    return () => window.clearInterval(id)
  }, [done])

  const progress = items.length ? Math.min(resolved, items.length) / items.length : 0

  return (
    <div
      className={cn("relative", className)}
      onPointerEnter={() => (pausedRef.current = true)}
      onPointerLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-paper-2/85 font-mono text-[12px] leading-relaxed text-ink-2 backdrop-blur-md sm:text-[13px]">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="size-2.5 rounded-full bg-ink/15" />
          </span>
          <span className="truncate text-[11px] tracking-wide">brainstack — {slug}</span>
        </div>

        {/* Service tabs */}
        <div
          role="tablist"
          aria-label="Services"
          className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2"
        >
          {services.map((item, index) => (
            <button
              key={item.slug ?? item.title}
              type="button"
              role="tab"
              aria-selected={index === active}
              // Starts with the visible tab number so the accessible name
              // contains the visible label.
              aria-label={`${item.id ?? String(index + 1).padStart(2, "0")} ${item.title}`}
              onClick={() => setActive(index)}
              className={cn(
                "relative shrink-0 cursor-pointer rounded-md px-2.5 py-1 text-[11px] tracking-wider transition-colors duration-300",
                index === active ? "bg-signal text-signal-ink" : "text-ink-2 hover:bg-ink/5 hover:text-ink"
              )}
            >
              {item.id ?? String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>

        {/* Run output — re-keyed per service so each run fades in fresh */}
        <div key={active} className="rise-fade min-h-[17.5rem] px-4 py-4 sm:px-5" style={{ "--i": 0 } as React.CSSProperties}>
          <p className="text-ink">
            <span className="text-signal-text">❯</span> {command.slice(0, typed)}
            {typing && <span className="animate-caret">▍</span>}
          </p>

          {!typing && (
            <p className="mt-3 font-sans text-base font-medium tracking-tight text-ink sm:text-lg">
              {service.title}
            </p>
          )}

          <ul className="mt-3 space-y-1.5">
            {!typing &&
              items.map((item, index) => {
                const isResolved = index < resolved
                const isRunning = index === resolved
                if (!isResolved && !isRunning) return null
                return (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn("w-3 text-center", isResolved ? "text-signal-text" : "text-ink-2")}
                    >
                      {isResolved ? "✓" : SPINNER[spin]}
                    </span>
                    <span className={isResolved ? "text-ink" : "text-ink-2"}>{item}</span>
                  </li>
                )
              })}
          </ul>
        </div>

        {/* Footer: run progress + the service's own link */}
        <div className="flex items-center gap-4 border-t border-line px-4 py-3 sm:px-5">
          <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
            <div
              className="h-full origin-left rounded-full bg-signal transition-transform duration-300 ease-premium"
              style={{ transform: `scaleX(${typing ? 0 : progress})` }}
            />
          </div>
          {service.buttonLabel && service.buttonHref && (
            <Link
              href={service.buttonHref}
              data-cursor="magnetic"
              className={cn(
                "group inline-flex shrink-0 items-center gap-1.5 text-[11px] tracking-wider uppercase transition-[color,opacity] duration-500",
                done ? "text-ink opacity-100 hover:text-signal-text" : "pointer-events-none opacity-40"
              )}
              tabIndex={done ? undefined : -1}
            >
              {service.buttonLabel}
              <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
