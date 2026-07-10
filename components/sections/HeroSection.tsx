"use client"

import ProjectVideo from "@/components/sections/ProjectVideo"
import { heroData } from "@/lib/data/hero"
import "@/lib/GSAPAnimations"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/all"
import { ArrowDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

gsap.registerPlugin(SplitText)

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const headingElement = heroRef.current?.querySelector("h1")
      if (!headingElement) return

      SplitText.create(headingElement, {
        type: "lines, words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            duration: 0.6,
            y: 10,
            opacity: 0.5,
            filter: "blur(6px)",
            autoAlpha: 0,
            stagger: 0.06,
          })
        },
      })
    },
    { scope: heroRef }
  )

  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col flex-nowrap">
      <div
        ref={heroRef}
        className="relative flex min-h-screen w-full flex-col overflow-hidden bg-brand-dark"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex w-full max-w-400 flex-1 flex-col justify-center px-5 pt-32 pb-20 sm:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h1 className="max-w-4xl text-5xl tracking-tight text-white uppercase sm:text-7xl lg:text-8xl">
              {heroData.title}{" "}
              <Link
                href={heroData.primaryButton.href}
                aria-label={heroData.primaryButton.text}
                className="group inline-flex align-middle"
                data-cursor="magnetic"
              >
                <ChevronRight className="inline size-12 transition-transform duration-300 group-hover:translate-x-2 sm:size-16 lg:size-20" />
              </Link>
            </h1>

            <div className="lg:w-90 lg:shrink-0">
              <p className="text-base leading-relaxed text-white/70 sm:text-xl">
                {heroData.description}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-end px-5 pb-8 sm:px-8">
          <button
            type="button"
            onClick={scrollToNext}
            aria-label="Scroll down to next section"
            className="group flex items-center gap-3 text-base font-bold tracking-widest text-white uppercase animate-pulse cursor-pointer hover:animate-none sm:text-lg"
            data-cursor="magnetic"
          >
            Scroll Down
            <ArrowDown className="size-6 animate-bounce transition-transform duration-300 group-hover:translate-y-1 sm:size-7" />
          </button>
        </div>
      </div>

      <ProjectVideo />
    </div>
  )
}
