"use client"

import { portfolioData } from "@/data/portfolio-data"
import { useScrollReveal } from "@/hooks/useScrollReveal"

export default function CapabilitiesSection() {
  const { capabilities } = portfolioData
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2
            className={`mb-4 text-4xl font-bold transition-all duration-700 md:text-5xl ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {capabilities.title}
          </h2>
          <p
            className={`text-xl text-foreground/60 transition-all delay-100 duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {capabilities.description}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {capabilities.categories.map((cat, idx) => (
            <div
              key={idx}
              className={`rounded-xl border border-border bg-card p-8 transition-all duration-700 hover:border-primary/50 hover:shadow-lg ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${(idx + 1) * 100}ms` : "0ms",
              }}
            >
              <h3 className="mb-6 text-2xl font-bold text-primary">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {cat.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
