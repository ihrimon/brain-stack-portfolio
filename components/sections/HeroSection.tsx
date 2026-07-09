"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import "@/lib/GSAPAnimations"
import { heroData } from "@/lib/data/hero"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { Pause, Play, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
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

    if (statsRef.current) {
      gsap.effects.staggerFadeUpOnScroll(statsRef.current, {
        start: "top 85%",
        duration: 0.6,
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
        className="hero space-y-10 px-5 pt-36 pb-8 text-center md:pt-44 md:pb-14"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
          <span className="bg-tag-bg w-fit rounded-full px-4 py-1.5 text-xs font-medium text-tag sm:text-sm">
            {heroData.badge}
          </span>

          <h1 className="mx-auto max-w-4xl text-4xl leading-[1.20] font-medium tracking-tight text-heading sm:text-6xl capitalize md:text-7xl">
            {heroData.title}
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-label sm:text-lg">
            {heroData.description}
          </p>

          <PrimaryButton
            href={heroData.primaryButton.href}
            className="px-12 py-6 text-base sm:text-lg"
          >
            {heroData.primaryButton.text}
          </PrimaryButton>
        </div>

        {/* <div
          ref={statsRef}
          className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border/50 md:grid-cols-4 md:divide-y-0"
        >
          {heroData.stats.map((stat) => (
            <div key={stat.title} className="p-5 text-left sm:p-6">
              <div className='flex items-center gap-3'>
              <p className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
                {stat.value}
                {stat.highlight && (
                  <span className="text-gradient-brand">{stat.highlight}</span>
                )}
              </p>
              <p className="mt-2 text-sm font-semibold text-heading">
                {stat.title}
              </p>

              </div>
              <p className="mt-1 text-xs text-label sm:text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div> */}

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
              <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl backdrop-blur transition-transform duration-300 hover:scale-110">
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
                className="absolute top-4 right-4 z-10 flex size-12 items-center justify-center rounded-full bg-black/70 cursor-pointer text-white backdrop-blur hover:bg-white/20"
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
