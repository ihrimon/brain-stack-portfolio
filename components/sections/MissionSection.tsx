"use client"

import { portfolioData } from '@/data/portfolio-data'
import { useScrollReveal } from "@/hooks/useScrollReveal"

export default function MissionSection() {
  const { mission } = portfolioData
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="about" ref={ref} className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div
            className={`space-y-8 transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div>
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                {mission.title}
              </h2>
              <p className="text-xl text-foreground/60">{mission.mission}</p>
            </div>

            <div className="space-y-6">
              {mission.values.map((value, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-lg font-bold text-primary">
                    {value.title}
                  </h3>
                  <p className="text-foreground/60">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`flex items-center justify-center transition-all delay-200 duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            <div className="relative aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-2xl"></div>
              <div className="absolute inset-0 rounded-3xl border border-primary/20 bg-primary/10"></div>
              <div className="relative flex h-full items-center justify-center text-8xl">
                💡
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
