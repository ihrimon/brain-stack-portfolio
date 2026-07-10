"use client"

import "@/lib/GSAPAnimations"
import { servicesData } from "@/lib/data/services"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

export default function ExtraServicesSection() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!cardsRef.current) return

    const cards = gsap.utils.toArray<HTMLElement>(
      "[data-service-card]",
      cardsRef.current
    )

    cards.forEach((card, index) => {
      const isLast = index === cards.length - 1

      ScrollTrigger.create({
        trigger: card,
        start: "top top+=96",
        end: isLast ? "bottom top" : () => `+=${window.innerHeight * 0.85}`,
        pin: true,
        pinSpacing: isLast,
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section id="services" className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="mb-16 flex flex-wrap items-start justify-between gap-8">
          <div className="">
            <span className="w-fit rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm">
              {servicesData.badge}
            </span>

            <h2 className="mt-6 max-w-3xl leading-tight font-light tracking-tight text-white uppercase md:text-5xl">
              {servicesData.title}
            </h2>
          </div>

          <Link
            href="/contact"
            className="mt-2 flex items-center gap-3 text-sm font-medium text-white hover:text-white/80"
            data-cursor="magnetic"
          >
            <span className="h-px w-10 bg-white/40" />
            View All
          </Link>
        </div>

        <div ref={cardsRef} className="relative">
          {servicesData.items.map((item, index) => (
            <div
              key={item.id}
              data-service-card
              className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900"
              style={{ zIndex: index + 1 }}
            >
              <div className="grid min-h-[70vh] md:grid-cols-2">
                <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16">
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
                      {item.category}
                    </span>

                    <h3 className="mt-4 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                      {item.description}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {item.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-white/70 sm:text-base"
                        >
                          <span className="size-1 shrink-0 rounded-full bg-white/40" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {item.eyebrow.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={item.cta.href}
                    className="group mt-10 flex w-fit items-center gap-2 font-medium text-white"
                    data-cursor="magnetic"
                  >
                    {item.cta.label}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

                <div className="relative min-h-64 md:min-h-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
