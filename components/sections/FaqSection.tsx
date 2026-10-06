"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
import "@/lib/animations/gsap-animations"
import type { FaqData } from "@/lib/data/home-page"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useId, useRef, useState } from "react"

interface FaqSectionProps {
  data: FaqData
}

/** Single-open accordion with no animation library: the panel's height
 * animates by transitioning its grid row from `0fr` to `1fr` (plain CSS),
 * and the plus icon turns into a minus. Closed panels are `inert`, so their
 * content is skipped by keyboard and assistive tech while collapsed. */
export default function FaqSection({ data }: FaqSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const idPrefix = useId()

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section id="faq" ref={sectionRef} className="relative z-10 py-20 sm:py-28">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <HeadingSection badge={data.badge} title={data.title} titleRef={titleRef} />

        {/* Centered column: questions and answers sit in the middle of the page. */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="divide-y divide-line border-y border-line">
            {data.items.map((item, index) => {
              const isOpen = index === openIndex
              const buttonId = `${idPrefix}-faq-button-${index}`
              const panelId = `${idPrefix}-faq-panel-${index}`

              return (
                <div key={item.question}>
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      data-cursor="magnetic"
                      className="group grid w-full cursor-pointer grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 text-left sm:grid-cols-[4rem_1fr_auto] sm:py-7"
                    >
                      <span
                        className={cn(
                          "font-mono text-[11px] tracking-wider transition-colors duration-300",
                          isOpen ? "text-signal-text" : "text-ink-2"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={cn(
                          "text-lg font-medium tracking-tight transition-colors duration-300 sm:text-xl",
                          isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink"
                        )}
                      >
                        {item.question}
                      </span>

                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                          isOpen
                            ? "border-signal bg-signal text-signal-ink"
                            : "border-line text-ink group-hover:border-ink"
                        )}
                      >
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span
                          className={cn(
                            "absolute h-3.5 w-px bg-current transition-transform duration-500 ease-premium",
                            isOpen && "rotate-90 scale-y-0"
                          )}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    inert={!isOpen}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-premium",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-3xl pb-8 pl-[calc(2.5rem+1rem)] text-base leading-relaxed text-ink-2 sm:pl-[calc(4rem+1rem)] sm:text-lg">
                        {item.answer}
                      </p>
                    </div>
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
