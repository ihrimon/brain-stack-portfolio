"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import "@/lib/animations/gsap-animations"
import type { TeamMembersData } from "@/lib/data/about-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"

interface TeamSectionProps {
  data: TeamMembersData
}

export default function TeamSection({ data }: TeamSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  // Created once and never reassigned, so a lazy useState initializer (safe
  // to read during render) is the correct place for this — unlike a ref,
  // which the lint rule correctly flags as unsafe to read in the render body
  // even when, as here, it never actually changes after mount.
  const [autoplay] = useState(() =>
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

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
      className="overflow-hidden bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <SectionBadge>{data.badge}</SectionBadge>

            <h2
              ref={titleRef}
              className="mt-8 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
            >
              {data.title}
            </h2>
          </div>

          <Link
            href="/about#team"
            data-cursor="magnetic"
            className="group/link inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-background hover:text-foreground"
          >
            View All Members
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>

        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[autoplay]}
          className="mt-16"
        >
          <CarouselContent className="-ml-5 sm:-ml-6">
            {data.members.map((member) => (
              <CarouselItem
                key={member.name}
                className="basis-1/2 pl-5 sm:pl-6 lg:basis-1/4"
              >
                <div className="group/glitch">
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-neutral-900">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover/glitch:animate-glitch-jitter"
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 45vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    <Image
                      src={member.image}
                      alt=""
                      aria-hidden="true"
                      fill
                      className="object-cover opacity-0 mix-blend-screen saturate-200 filter-[hue-rotate(180deg)] transition-opacity duration-150 group-hover/glitch:opacity-60 group-hover/glitch:animate-glitch-cyan"
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 45vw"
                    />
                    <Image
                      src={member.image}
                      alt=""
                      aria-hidden="true"
                      fill
                      className="object-cover opacity-0 mix-blend-screen saturate-200 filter-[hue-rotate(-40deg)] transition-opacity duration-150 group-hover/glitch:opacity-60 group-hover/glitch:animate-glitch-red"
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 45vw"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-white opacity-0 mix-blend-overlay group-hover/glitch:animate-glitch-blink"
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-white/50">{member.role}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex items-center justify-center gap-3">
            <CarouselPrevious className="static size-10 translate-x-0 translate-y-0 border-white/20 bg-transparent hover:bg-background hover:text-foreground" />
            <CarouselNext className="static size-10 translate-x-0 translate-y-0 border-white/20 bg-transparent hover:bg-background hover:text-foreground" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
