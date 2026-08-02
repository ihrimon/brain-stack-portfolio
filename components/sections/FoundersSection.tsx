"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { HeadingSection } from "@/components/common/HeadingSection"
import "@/lib/animations/gsap-animations"
import type { FoundersData } from "@/lib/data/home-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { BookOpen, Quote, User } from "lucide-react"
import Image from "next/image"
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
        <HeadingSection
          badge={data.badge}
          title={data.title}
          titleRef={titleRef}
          description={data.description}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {data.members.map((member) => (
            <div
              key={member.name}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-dark xl:flex-row xl:items-stretch"
            >
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                  <User className="size-3.5" />
                  {member.title}
                </span>

                <h3 className="mt-4 text-3xl leading-tight font-bold text-white sm:text-3xl">
                  {member.name}
                </h3>
                <p className="mt-4 text-sm text-white/70">{member.bio}</p>

                <div className="my-4 flex items-start gap-3 border-t border-white/10 pt-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BookOpen className="size-4" />
                  </span>
                  <div>
                    <p className="text-white text-sm">{member.skills.join(" · ")}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 pt-4 xl:mt-auto">
                  <div>
                    <p className="font-semibold text-white">
                      Let&apos;s Connect
                    </p>
                    <p className="mt-2 text-sm text-white/50">
                      Open to collaboration and new projects.
                    </p>
                  </div>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="me noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    data-cursor="magnetic"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white uppercase transition-colors hover:bg-primary-hover"
                  >
                    in
                  </a>
                </div>
              </div>

              <div className="relative aspect-square w-full shrink-0 p-4 sm:p-6 xl:aspect-auto xl:w-80">
                <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 ">
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 384px, 100vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <blockquote className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl text-left sm:flex-row sm:items-center">
          <div className="flex items-start gap-8 lg:gap-30">
            <Quote
              aria-hidden="true"
              className="size-12 shrink-0 text-primary"
            />
            <p className="max-w-xl text-2xl leading-relaxed font-medium text-white">
              {data.footnote}
            </p>
          </div>

          <PrimaryButton href="/contact" className="shrink-0">
            Let&apos;s Work Together
          </PrimaryButton>
        </blockquote>
      </div>
    </section>
  )
}
