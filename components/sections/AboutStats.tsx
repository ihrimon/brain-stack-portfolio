"use client"

import { aboutStatsData } from "@/lib/data/about-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

export default function AboutStats() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const values = gsap.utils.toArray<HTMLElement>(
        "[data-stat-value]",
        sectionRef.current
      )

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          values.forEach((el) => {
            const target = Number(el.dataset.statValue)
            const counter = { value: 0 }

            gsap.to(counter, {
              value: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(counter.value).toString()
              },
            })
          })
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="w-full bg-brand-dark">
      <div className="w-full border-y border-white/10">
        <div className="mx-auto max-w-400 px-5 sm:px-8">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
            {aboutStatsData.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center sm:py-16"
              >
                <p className="text-4xl font-semibold text-white sm:text-5xl">
                  <span data-stat-value={stat.value}>0</span>
                  {stat.suffix}
                </p>

                <p className="text-xs tracking-widest text-white/50 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
