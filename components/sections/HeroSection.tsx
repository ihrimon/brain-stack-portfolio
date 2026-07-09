"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { GlassCard } from "@/components/cards/GlassCard"
import "@/lib/GSAPAnimations"
import { caseStudies } from "@/lib/caseStudies"
import { heroData } from "@/lib/data/hero"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { Pause, Play, Star } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { Marquee } from "../shared/marquee"

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const videoScaleRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const caseStudiesRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const userPausedRef = useRef(false)

  useGSAP(() => {
    const headingElement = heroRef?.current?.querySelector("h1")
    if (headingElement) {
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
    }

    if (statsRef.current) {
      gsap.effects.staggerFadeUpOnScroll(statsRef.current, {
        start: "top 85%",
        duration: 0.6,
      })
    }

    if (caseStudiesRef?.current) {
      gsap.effects.fadeUpOnScroll(caseStudiesRef.current, {
        start: "top 80%",
        duration: 0.8,
      })
    }

    if (videoWrapperRef.current && videoScaleRef.current) {
      gsap.to(videoScaleRef.current, {
        keyframes: { "0%": { scale: 0.5 }, "50%": { scale: 0.75 }, "100%": { scale: 1 } },
        ease: "none",
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: "top 75%",
          end: "bottom center",
          scrub: 1,
          onUpdate: (self) => {
            const video = videoRef.current
            if (!video || userPausedRef.current) return

            if (self.progress >= 0.98) {
              video.play().catch(() => {})
              setIsPlaying(true)
            } else if (video.currentTime > 0) {
              video.pause()
              setIsPlaying(false)
            }
          },
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      userPausedRef.current = false
      video.play().catch(() => {})
      setIsPlaying(true)
    } else {
      userPausedRef.current = true
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="flex flex-col flex-nowrap">
      <div
        ref={heroRef}
        className="hero space-y-10 px-5 pt-36 pb-8 text-center md:pt-44 md:pb-14"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
          <span className="bg-tag-bg w-fit rounded-full px-4 py-1.5 text-xs font-medium text-tag sm:text-sm">
            {heroData.badge}
          </span>

          <h1 className="mx-auto max-w-4xl text-4xl leading-[1.05] font-bold tracking-tight text-heading sm:text-6xl md:text-7xl">
            {heroData.title}
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-label sm:text-lg">
            {heroData.description}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <PrimaryButton href={heroData.primaryButton.href}>
              {heroData.primaryButton.text}
            </PrimaryButton>

            <div className="flex items-center gap-2 text-sm text-label">
              <div className="flex text-brand-accent">
                {Array.from({ length: heroData.review.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              {heroData.review.label}
            </div>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          {heroData.stats.map((stat) => (
            <GlassCard key={stat.title} className="p-5 text-left sm:p-6">
              <p className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
                {stat.value}
                {stat.highlight && (
                  <span className="text-gradient-brand">{stat.highlight}</span>
                )}
              </p>
              <p className="mt-2 text-sm font-semibold text-heading">
                {stat.title}
              </p>
              <p className="mt-1 text-xs text-label sm:text-sm">
                {stat.description}
              </p>
            </GlassCard>
          ))}
        </div>

        <div ref={videoWrapperRef} className="relative py-24">
          <div className="sticky top-32 flex items-center justify-center">
            <div
              ref={videoScaleRef}
              className="group relative aspect-video w-full max-w-4xl origin-center overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
              style={{ scale: 0.5 }}
            >
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/short.mp4" type="video/mp4" />
              </video>

              <button
                type="button"
                onClick={toggleVideo}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur transition-transform hover:scale-105"
                data-cursor="magnetic"
              >
                {isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="ml-0.5 size-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* <div
          ref={caseStudiesRef}
          className="relative"
          role="region"
          aria-label="Our trusted clients"
        >
          <h2 className="sr-only!">{`Companies We've Helped Transform`}</h2>
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-12 bg-linear-to-r from-background via-background/90 to-transparent md:w-48" />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-12 bg-linear-to-l from-background via-background/90 to-transparent md:w-48" />

          <Marquee pauseOnHover className="mt-4">
            {caseStudies.map((caseStudy, index) => (
              <div
                key={`${caseStudy.name}-${index}`}
                className="group mx-1 shrink-0 cursor-pointer md:mx-4"
              >
                <div className="relative flex h-16 items-center justify-center p-4 transition-all duration-300 ease-in-out">
                  <Image
                    src={caseStudy.logo_src}
                    alt={`${caseStudy.project_title} logo`}
                    className="max-h-full max-w-full object-contain opacity-80 grayscale filter transition-all duration-300 ease-in-out hover:opacity-100 hover:brightness-110 hover:grayscale-0"
                    loading="lazy"
                    decoding="async"
                    width={100}
                    height={80}
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div> */}
      </div>
    </div>
  )
}
