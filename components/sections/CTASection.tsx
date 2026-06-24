"use client"

import { portfolioData } from '@/data/portfolio-data'
import { useScrollReveal } from "@/hooks/useScrollReveal"

export default function CTASection() {
  const { cta } = portfolioData
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="contact" ref={ref} className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div
          className={`space-y-8 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-primary/10 p-12 text-center transition-all duration-700 md:p-16 ${
            isVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-10 scale-95 opacity-0"
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold md:text-5xl">{cta.title}</h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/60">
              {cta.description}
            </p>
          </div>

          <button className="inline-block rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90">
            {cta.button}
          </button>
        </div>
      </div>
    </section>
  )
}
