"use client"

import { caseStudies } from "@/lib/caseStudies"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useRef } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

export default function CaseStudiesSection() {
  const caseStudiesRef = useRef(null)
  return (
    <Carousel
      ref={caseStudiesRef}
      opts={{
        align: "start",
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      aria-label="case-studies"
      aria-labelledby="featured-case-studies-heading"
      id="case-studies-section"
      className="relative mt-14 w-full"
    >
      <h2 id="featured-case-studies-heading" className="sr-only!">
        Featured Case Studies
      </h2>
      <div className="pointer-events-none absolute top-0 left-0 z-5 h-full w-12 bg-linear-to-r from-gray-50/80 via-gray-50/20 to-transparent md:w-36"></div>

      <div className="pointer-events-none absolute top-0 right-0 z-5 h-full w-12 bg-linear-to-l from-gray-50/90 via-gray-50/20 to-transparent md:w-36"></div>

      <CarouselContent>
        {caseStudies.map((caseStudy, index) => (
          <CarouselItem
            key={`${caseStudy.name}-carousel-${index}`}
            className="md:basis-1/2 lg:basis-1/4"
            data-carousel-item
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${caseStudies.length}: ${caseStudy.name}`}
          >
            <div
              key={`case-study-${index}`}
              className="w-full max-w-sm space-y-3 text-left"
            >
              <div className="flex aspect-square items-center justify-center rounded-md bg-tag-bg p-4">
                <Image
                  src={caseStudy["main_image_src"]}
                  className="max-h-full max-w-full object-contain"
                  alt={`${caseStudy.name} project preview - ${caseStudy.project_title}`}
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding={index < 4 ? "sync" : "async"}
                  width={100}
                  height={80}
                />
              </div>
              <div className="space-y-1">
                <p className="text-md leading-snug text-heading">
                  {caseStudy["project_title"]}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-heading">
                    Standard Draft
                  </p>
                  <p className="text-sm text-heading">[AI DOCUMENT]</p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        aria-label="Previous case study"
        className="left-0 z-50 size-9 translate-x-0 border-0 bg-gray-500/50"
      />
      <CarouselNext
        aria-label="Next case study"
        className="right-0 z-50 size-9 translate-x-0 border-0 bg-gray-500/50"
      />
    </Carousel>
  )
}
