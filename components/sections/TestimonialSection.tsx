"use client"

import { portfolioData } from '@/data/portfolio-data'
import { useScrollReveal } from "@/hooks/useScrollReveal"

export default function TestimonialsSection() {
  const { testimonials } = portfolioData
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2
            className={`mb-4 text-4xl font-bold transition-all duration-700 md:text-5xl ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            What Our Clients Say
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`rounded-xl border border-border bg-card p-8 transition-all duration-700 hover:border-primary/50 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${(idx + 1) * 100}ms` : "0ms",
              }}
            >
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="mb-6 text-lg leading-relaxed text-foreground/80">
                {"{testimonial.quote}"}
              </p>
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-foreground/60">
                      {testimonial.role}
                    </p>
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
