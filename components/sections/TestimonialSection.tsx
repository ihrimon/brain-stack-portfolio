"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { TestimonialsData } from "@/lib/data/home-page"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Quote, Star } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode } from "react"

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

const AUTOPLAY_MS = 5000

interface TestimonialSectionProps {
  data: TestimonialsData
}

export default function TestimonialSection({ data }: TestimonialSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const { items } = data
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current, descRef.current])
    },
    { scope: sectionRef }
  )

  // Autoplay steps one testimonial at a time and loops back to the start.
  // Restarting on every activeIndex change (autoplay-driven or manual click)
  // means a manual click always resets the countdown to a full interval.
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [activeIndex, items.length])

  // Crossfade the visible pair in whenever the active index changes.
  useEffect(() => {
    if (!trackRef.current) return
    gsap.fromTo(
      trackRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
  }, [activeIndex])

  const visiblePair = [
    items[activeIndex],
    items[(activeIndex + 1) % items.length],
  ]

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="max-w-4xl">
          <SectionBadge>{data.badge}</SectionBadge>

          <h2
            ref={titleRef}
            className="mt-8 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
          >
            {data.title}
          </h2>
        </div>

        <div ref={trackRef} className="mt-16 grid gap-12 sm:grid-cols-2">
          {visiblePair.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative flex flex-col rounded-2xl border-white/10 bg-neutral-900 p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex" aria-hidden="true">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {testimonial.title}
                  </h3>
                </div>

                <div className="relative size-24 shrink-0 overflow-hidden rounded-xs">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </div>

              <p className="mt-4 max-w-md text-2xl leading-normal text-white/70">
                {highlightQuote(testimonial.quote, testimonial.highlight)}
              </p>

              <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-white/50">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>

                <Quote className="size-20 shrink-0 text-white/10" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center">
          {items.map((_, index) => (
            <div key={index} className="flex items-center">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show testimonial ${index + 1}`}
                className={cn(
                  "size-2.5 shrink-0 cursor-pointer rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "scale-125 bg-brand-accent"
                    : index < activeIndex
                      ? "bg-brand-accent"
                      : "bg-white/30 hover:bg-white/50"
                )}
              />
              {index < items.length - 1 && (
                <span
                  className={cn(
                    "h-px w-8 transition-colors duration-300 sm:w-12",
                    index < activeIndex ? "bg-brand-accent" : "bg-white/15"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
