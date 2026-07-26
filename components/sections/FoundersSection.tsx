"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { FoundersData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface FoundersSectionProps {
  data: FoundersData
}

export default function FoundersSection({ data }: FoundersSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="founders"
      ref={sectionRef}
      className="bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="max-w-3xl">
          <SectionBadge className="mb-8 w-fit">{data.badge}</SectionBadge>

          <h2
            ref={titleRef}
            className="text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
          >
            {data.title}
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {data.description}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {data.members.map((member) => (
            <div
              key={member.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-neutral-900 p-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                  {member.initials}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-white/50">{member.title}</p>
                </div>
              </div>

              <p className="mt-6 text-white/70">{member.bio}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <a
                href={member.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                data-cursor="magnetic"
                className="mt-8 flex size-11 w-fit items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white uppercase transition-colors hover:bg-white/20"
              >
                in
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-white/50">{data.footnote}</p>
      </div>
    </section>
  )
}
