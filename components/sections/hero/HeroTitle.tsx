"use client"

import { cn } from "@/lib/utils/cn"
import { Pencil } from "lucide-react"
import { Fragment, useEffect, useState, type CSSProperties } from "react"

const ROTATION_INTERVAL_MS = 6000
const INTERACTION_EVENTS = ["pointermove", "scroll", "keydown", "touchstart"] as const

interface HeroTitleProps {
  titles: readonly string[]
  highlights: readonly string[]
  className?: string
}

/** Splits `title` into words, flagging the ones inside `highlight` (matched
 * case-insensitively), so each word can be masked and risen individually.
 * Rendered by React rather than a DOM splitter, so swapping titles is safe. */
function splitTitle(title: string, highlight: string) {
  // lastIndexOf: the highlight is the closing phrase of the title.
  const start = highlight ? title.toLowerCase().lastIndexOf(highlight.toLowerCase()) : -1
  const end = start === -1 ? -1 : start + highlight.length
  let cursor = 0

  return title.split(" ").map((text) => {
    const highlighted = start !== -1 && cursor >= start && cursor < end
    cursor += text.length + 1
    return { text, highlighted }
  })
}

/**
 * The hero headline, rotating through `titles`. Every swap replays the CSS
 * word-rise (`.rise-word` in globals.css) by re-keying the active title.
 *
 * Two Core Web Vitals guards, since this is the page's LCP element:
 * - Every title is laid out in the same grid cell from the start (inactive
 *   ones `invisible`), so the heading is always as tall as its longest
 *   title and a swap never shifts the content below it (CLS).
 * - Rotation only starts after the visitor first interacts. Browsers stop
 *   measuring LCP at that point, so a later, larger title can't be counted
 *   as a late LCP. Reduced-motion visitors keep the first title.
 */
export function HeroTitle({ titles, highlights, className }: HeroTitleProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (titles.length <= 1) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let intervalId: number | undefined
    const start = () => {
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, start))
      intervalId = window.setInterval(
        () => setIndex((current) => (current + 1) % titles.length),
        ROTATION_INTERVAL_MS
      )
    }
    INTERACTION_EVENTS.forEach((type) =>
      window.addEventListener(type, start, { passive: true })
    )

    return () => {
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, start))
      window.clearInterval(intervalId)
    }
  }, [titles.length])

  return (
    <h1 id="hero-title" className={cn("grid", className)}>
      {titles.map((title, titleIndex) => {
        const active = titleIndex === index
        const words = splitTitle(title, highlights[titleIndex] ?? "")
        const lastHighlighted = words.reduce((last, w, i) => (w.highlighted ? i : last), -1)

        // Consecutive words grouped by highlight state, so the highlighted
        // phrase can carry one pen underline beneath it.
        const groups: { highlighted: boolean; words: { text: string; i: number }[] }[] = []
        words.forEach((word, i) => {
          const tail = groups[groups.length - 1]
          if (tail && tail.highlighted === word.highlighted) tail.words.push({ text: word.text, i })
          else groups.push({ highlighted: word.highlighted, words: [{ text: word.text, i }] })
        })

        const renderWord = ({ text, i }: { text: string; i: number }, isLast: boolean) => (
          <Fragment key={i}>
            {/* The space sits outside the inline-block mask — inside it, it
                would collapse and the words would run together. */}
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span
                className={cn("inline-block", active && "rise-word")}
                style={{ "--i": i } as CSSProperties}
              >
                {text}
              </span>
            </span>
            {!isLast && " "}
          </Fragment>
        )

        return (
          <span
            // Re-keyed per activation so the rise (and pen line) replay on every swap.
            key={active ? `active-${index}` : `idle-${titleIndex}`}
            aria-hidden={active ? undefined : true}
            className={cn("[grid-area:1/1]", !active && "invisible")}
          >
            {groups.map((group, g) => {
              const isLastGroup = g === groups.length - 1
              const content = group.words.map((w, k) =>
                renderWord(w, k === group.words.length - 1)
              )
              return (
                <Fragment key={g}>
                  {group.highlighted ? (
                    <Highlight
                      active={active}
                      // Draws in once the last highlighted word has risen.
                      delayMs={lastHighlighted * 30 + 520}
                    >
                      {content}
                    </Highlight>
                  ) : (
                    content
                  )}
                  {!isLastGroup && " "}
                </Fragment>
              )
            })}
          </span>
        )
      })}
    </h1>
  )
}

/**
 * Hand-drawn pen underline: a single slightly wavering ink line drawn in
 * from the phrase's first character to its last (stroke-dashoffset,
 * `.pen-draw` in globals.css). A pencil rides the tip of the line as it's
 * drawn and then rests at the end of the line (`.pen-ride`). The text keeps its own color. Hovering the phrase
 * redraws it.
 */
function Highlight({
  children,
  active,
  delayMs,
}: {
  children: React.ReactNode
  active: boolean
  delayMs: number
}) {
  const [run, setRun] = useState(0)

  return (
    <span
      className="relative inline-block whitespace-nowrap"
      onPointerEnter={() => setRun((r) => r + 1)}
    >
      {children}
      <svg
        key={run}
        aria-hidden="true"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-[0.06em] h-[0.16em] w-full overflow-visible"
        style={{ "--draw-delay": `${run ? 0 : active ? delayMs : 0}ms` } as CSSProperties}
      >
        <path
          className={cn(active && "pen-draw")}
          d="M1 7 C 30 4, 58 9, 92 6.5 S 150 4, 172 6.8 S 194 7.5, 199 5.5"
          pathLength={1}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {active && (
        <span
          key={`pen-${run}`}
          aria-hidden="true"
          className="pen-ride pointer-events-none absolute bottom-[-0.04em] text-signal"
          style={{ "--draw-delay": `${run ? 0 : delayMs}ms` } as CSSProperties}
        >
          {/* Lucide's pencil tip is its bottom-left corner — that corner sits
              on the line. */}
          <Pencil className="size-[0.34em] fill-paper" strokeWidth={2} />
        </span>
      )}
    </span>
  )
}
