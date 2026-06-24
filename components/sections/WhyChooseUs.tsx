"use client"

import { portfolioData } from '@/data/portfolio-data'
import { useScrollReveal } from "@/hooks/useScrollReveal"

export default function WhyChooseSection() {
  const { whyChoose } = portfolioData
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2
            className={`text-4xl font-bold transition-all duration-700 md:text-5xl ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {whyChoose.title}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {whyChoose.reasons.map((reason, idx) => (
            <div
              key={idx}
              className={`rounded-xl border border-border bg-card p-8 transition-all duration-500 hover:border-primary/50 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${(idx + 1) * 100}ms` : "0ms",
              }}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold">{reason.title}</h3>
                  <p className="mb-4 text-foreground/60">
                    {reason.description}
                  </p>
                  <div className="flex gap-4">
                    <div className="text-2xl font-bold text-primary">
                      {reason.metric}
                    </div>
                    <div className="flex items-center text-sm text-foreground/60">
                      {reason.metricLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
