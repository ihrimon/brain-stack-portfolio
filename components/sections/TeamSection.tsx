"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import type { TeamMembersData } from "@/lib/data/about-page"
import { cn } from "@/lib/utils/cn"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import { useRef } from "react"

interface TeamSectionProps {
  data: TeamMembersData
}

export default function TeamSection({ data }: TeamSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll([titleRef.current])
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="team"
      ref={sectionRef}
      className="overflow-hidden bg-surface-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.8fr] lg:items-center lg:gap-12">
          <div className="flex flex-col items-start gap-6">
            <SectionBadge>{data.badge}</SectionBadge>

            <h2
              ref={titleRef}
              className="text-4xl leading-tight font-bold text-white sm:text-5xl"
            >
              {data.title}
            </h2>

            <p className="max-w-lg text-xl leading-relaxed text-white/60">
              {data.description}
            </p>

            <PrimaryButton href="/about#team">See All Members</PrimaryButton>
          </div>

          {/* 4-up on tablet, but back to 2-up through the laptop range
              (~1024–1535px, covers a 13" MacBook Air) where this grid shares
              its row with the text column at `lg:grid-cols-[1fr_1.8fr]`
              above — 4 photo columns there were too narrow to read. Only
              wide desktop monitors (`2xl:`, 1536px+) get 4 columns again. */}
          <div className="mx-auto grid w-full max-w-5xl grid-cols-2 overflow-hidden rounded-2xl sm:grid-cols-4 lg:mx-0 lg:ml-auto lg:grid-cols-2 2xl:grid-cols-4">
            {data.members.slice(0, 6).map((member, index) => (
              <div
                key={member.name}
                className={cn(
                  "group/photo relative aspect-4/5 overflow-hidden border border-white/10",
                  index % 2 === 0 ? "bg-neutral-700" : "bg-neutral-800"
                )}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover/photo:scale-105"
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 33vw, 45vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {member.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium tracking-wider text-white/60 uppercase">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
