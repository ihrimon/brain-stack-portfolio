"use client"

import type { AboutStatsData } from "@/lib/data/about-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface AboutStatsProps {
  stats: AboutStatsData
}

export default function AboutStats({ stats }: AboutStatsProps) {
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
              ease: "expo.out",
              onUpdate: () => {
                el.textContent = Math.round(counter.value).toString()
              },
            })
          })
        },
      })

      // No manual cleanup needed — useGSAP's automatic gsap.context().revert()
      // (scoped to sectionRef) already tears down the ScrollTrigger created
      // above.
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="w-full">
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <dl className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-between gap-10 border-r border-b border-line p-6 sm:p-8"
            >
              <dt className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
                {stat.label}
              </dt>
              <dd className="text-[clamp(2.75rem,5vw,5rem)] leading-none font-medium tracking-[-0.04em] text-ink tabular-nums">
                {/* Server-rendered at the real value so it's never shown
                    as 0 without JS; the count-up replays it on scroll. */}
                <span data-stat-value={stat.value}>{stat.value}</span>
                <span className="text-signal">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
