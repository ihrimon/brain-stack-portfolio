"use client"

import { portfolioData } from '@/data/portfolio-data'
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useState } from "react"

export default function FAQSection() {
  const { faq } = portfolioData
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2
            className={`mb-4 text-4xl font-bold transition-all duration-700 md:text-5xl ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faq.map((item, idx) => (
            <div
              key={idx}
              className={`overflow-hidden rounded-lg border border-border transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${(idx + 1) * 50}ms` : "0ms",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between bg-card px-6 py-4 transition-colors hover:bg-card/80"
              >
                <span className="text-left text-lg font-semibold">
                  {item.question}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
              {openIndex === idx && (
                <div className="border-t border-border bg-background px-6 py-4">
                  <p className="leading-relaxed text-foreground/70">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
