"use client"

import { portfolioData } from '@/data/portfolio-data'
import { useScrollReveal } from "@/hooks/useScrollReveal"

export default function ProcessSection() {
  const { process } = portfolioData
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="process" ref={ref} className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2
            className={`mb-4 text-4xl font-bold transition-all duration-700 md:text-5xl ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {process.title}
          </h2>
        </div>

        <div className="space-y-12">
          {process.phases.map((phase, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-8 transition-all duration-700 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${(idx + 1) * 100}ms` : "0ms",
              }}
            >
              <div className="shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/20 text-lg font-bold text-primary">
                  {phase.number}
                </div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="mb-3 text-2xl font-bold">{phase.title}</h3>
                <p className="text-lg text-foreground/60">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-lg text-foreground/70">
            <span className="font-bold text-primary">
              Ready to get started?
            </span>{" "}
            Let&apos;s schedule a consultation to discuss your project
            requirements.
          </p>
        </div>
      </div>
    </section>
  )
}
