"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { FaqData } from "@/lib/data/home-page"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import { AnimatePresence, motion } from "framer-motion"
import gsap from "gsap"
import { ChevronDown } from "lucide-react"
import { useId, useRef, useState } from "react"

interface FaqSectionProps {
  data: FaqData
}

/** Single-open accordion — hand-rolled with framer-motion (already a project
 * dependency) rather than adding @radix-ui/react-accordion, per the "no new
 * dependencies" constraint on this content sprint. */
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
    <section
      id="faq"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="max-w-3xl">
          <SectionBadge className="mb-8 w-fit">{data.badge}</SectionBadge>

          <h2
            ref={titleRef}
            className="text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
          >
            {data.title}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-white/10 border-t border-b border-white/10">
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
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                    data-cursor="magnetic"
                  >
                    <span className="text-lg font-medium text-white sm:text-xl">
                      {item.question}
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-5 shrink-0 text-white/50 transition-transform duration-300",
                        isOpen && "rotate-180 text-white"
                      )}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-6 leading-relaxed text-white/70">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
