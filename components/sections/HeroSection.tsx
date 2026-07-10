"use client"

import { heroData } from "@/lib/data/hero"
import "@/lib/GSAPAnimations"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { ArrowDown, ChevronRight, Pause, Play, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const userClosedRef = useRef(false)

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

    if (videoSectionRef.current && videoRef.current) {
      const video = videoRef.current

      // Autoplay once the video section enters the viewport.
      ScrollTrigger.create({
        trigger: videoSectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => video.play().catch(() => {}),
        onEnterBack: () => video.play().catch(() => {}),
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause(),
      })

      // Open as a blocking modal once the section crosses viewport center.
      // Only the close button dismisses it — scrolling further doesn't.
      ScrollTrigger.create({
        trigger: videoSectionRef.current,
        start: "center 60%",
        onEnter: () => {
          if (!userClosedRef.current) setIsFullscreen(true)
        },
        onLeaveBack: () => {
          userClosedRef.current = false
          setIsFullscreen(false)
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  // Block interaction with the rest of the page while the modal is open.
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreen])

  // Unmute once the video opens as a modal; mute again in the small inline preview.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isFullscreen
  }, [isFullscreen])

  const closeFullscreen = () => {
    userClosedRef.current = true
    setIsFullscreen(false)
  }

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
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
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <h1 className="max-w-4xl text-5xl leading-[1] tracking-tight text-white uppercase sm:text-7xl lg:text-8xl">
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

            <div className="lg:w-72 lg:shrink-0">
              <p className="max-w-xs text-base leading-relaxed text-white/70 sm:text-lg">
                {heroData.description}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-8 sm:px-8">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-white uppercase">
            Scroll Down
            <ArrowDown className="size-4" />
          </div>
          <p className="text-xs font-bold tracking-widest text-white uppercase">
            London · New York · Berlin
          </p>
        </div>
      </div>

      <div className="px-5">
        <div
          ref={videoSectionRef}
          className="relative flex items-start justify-center"
          style={{ height: "160vh" }}
        >
          {isFullscreen && (
            <div
              className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm"
              aria-hidden="true"
            />
          )}

          <div
            className={cn(
              "group overflow-hidden border border-border bg-card shadow-2xl transition-all duration-500 ease-in-out",
              isFullscreen
                ? "fixed inset-0 z-100 m-auto md:h-[80vh] md:w-[99vw] md:max-w-7xl rounded-3xl"
                : "relative mx-auto aspect-video w-full max-w-4xl rounded-3xl"
            )}
          >
            <video
              ref={videoRef}
              className={cn(
                "h-full w-full",
                isFullscreen ? "bg-black object-contain" : "object-cover"
              )}
              muted
              loop
              playsInline
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/short.mp4" type="video/mp4" />
            </video>

            <button
              type="button"
              onClick={toggleVideo}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              data-cursor="magnetic"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl backdrop-blur transition-transform duration-300 cursor-pointer hover:scale-110">
                {isPlaying ? (
                  <Pause className="size-6 fill-current" />
                ) : (
                  <Play className="ml-1 size-6 fill-current" />
                )}
              </span>
            </button>

            {isFullscreen && (
              <button
                type="button"
                onClick={closeFullscreen}
                aria-label="Close video"
                className="absolute top-4 right-4 z-10 flex size-12 items-center justify-center rounded-full bg-black/70 cursor-pointer text-white backdrop-blur hover:bg-white/20 hover:text-background hover:border"
                data-cursor="magnetic"
              >
                <X className="size-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
