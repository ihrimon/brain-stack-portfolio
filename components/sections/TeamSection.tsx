"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
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
import Image from "next/image"
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
      className="overflow-hidden bg-brand-dark py-20 sm:py-28 bg-neutral-900"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <HeadingSection
          badge={data.badge}
          title={data.title}
          titleRef={titleRef}
          link={{ label: "View All Members", href: "/about#team" }}
        />

        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[autoplay]}
          className="mt-16"
        >
          <CarouselContent className="-ml-5 sm:-ml-6">
            {data.members.map((member) => (
              <CarouselItem
                key={member.name}
                className="basis-1/2 pl-5 sm:basis-1/3 sm:pl-6 lg:basis-1/4"
              >
                <div className="group/photo">
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-neutral-900">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover duration-700 ease-out group-hover/photo:scale-110 transition-all"
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 45vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
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

          <CarouselPrevious
            className="left-3 size-12 cursor-pointer border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 sm:left-4"
            icon={
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                width={16}
                height={16}
                className="invert -scale-x-100"
              />
            }
          />
          <CarouselNext
            className="right-3 size-12 cursor-pointer border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 sm:right-4"
            icon={
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                width={16}
                height={16}
                className="invert"
              />
            }
          />
        </Carousel>
      </div>
    </section>
  )
}
