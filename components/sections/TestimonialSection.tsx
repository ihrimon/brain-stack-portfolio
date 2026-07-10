"use client"

import { testimonialsData } from "@/lib/data/testimonials"
import { cn } from "@/lib/utils"
import { Quote, Star } from "lucide-react"
import Image from "next/image"
import { useMemo, useState, type ReactNode } from "react"

type Testimonial = (typeof testimonialsData.items)[number]

function highlightQuote(quote: string, highlight?: string): ReactNode {
  if (!highlight) return quote

  const index = quote.indexOf(highlight)
  if (index === -1) return quote

  return (
    <>
      {quote.slice(0, index)}
      <strong className="font-semibold text-white">{highlight}</strong>
      {quote.slice(index + highlight.length)}
    </>
  )
}

export default function TestimonialSection() {
  const { items } = testimonialsData

  const slides = useMemo(() => {
    const grouped: Testimonial[][] = []
    for (let i = 0; i < items.length; i += 2) {
      grouped.push(items.slice(i, i + 2))
    }
    return grouped
  }, [items])

  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <section id="testimonials" className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-xl">
            <span className="w-fit rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm">
              {testimonialsData.badge}
            </span>

            <h2 className="mt-6 text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
              {testimonialsData.title}
            </h2>

            {/* <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              {testimonialsData.description}
            </p> */}
          </div>

          {/* <div className="flex items-center divide-x divide-white/15">
            {testimonialsData.reviewPlatforms.map((platform) => (
              <div
                key={platform.label}
                className="flex flex-col items-start gap-1 px-6 first:pl-0 last:pr-0"
              >
                <span className="text-xs font-medium text-white/70">
                  Review on
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">
                    {platform.label}
                  </span>
                  <div className="flex" aria-hidden="true">
                    {Array.from({ length: platform.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-white/50">
                  ({platform.reviews} Reviews)
                </span>
              </div>
            ))}
          </div> */}
        </div>

        <div className="relative mt-16 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className="grid w-full shrink-0 gap-6 sm:grid-cols-2"
              >
                {slide.map((testimonial) => (
                  <div
                    key={testimonial.author}
                    className="relative flex flex-col rounded-3xl border border-white/10  p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex" aria-hidden="true">
                          {Array.from({ length: testimonial.rating }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="size-4 fill-amber-400 text-amber-400"
                              />
                            )
                          )}
                        </div>

                        <h3 className="mt-4 text-2xl font-semibold text-white">
                          {testimonial.title}
                        </h3>
                      </div>

                      <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <p className="mt-4 text-2xl max-w-md leading-normal text-white/70">
                      {highlightQuote(testimonial.quote, testimonial.highlight)}
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                      <div>
                        <p className="font-semibold text-lg text-white">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-white/50">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>

                      <Quote
                        className="size-20 shrink-0 text-white/10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show testimonials ${index + 1}`}
                className={cn(
                  "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                  index === activeSlide
                    ? "w-6 bg-brand-accent"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
