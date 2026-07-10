"use client"

import "@/lib/GSAPAnimations"
import { getLenis } from "@/lib/lenis"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { Pause, Play, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

export default function ProjectVideo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const userClosedRef = useRef(false)

  useGSAP(
    () => {
      if (!sectionRef.current || !boxRef.current || !videoRef.current) return

      const video = videoRef.current

      // Grows from a small preview (scale 0.5) up to its natural size as
      // the section scrolls into view, before the modal takes over.
      gsap.fromTo(
        boxRef.current,
        { scale: 0.5 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "center 60%",
            scrub: true,
          },
        }
      )

      // Autoplay once the section enters the viewport.
      ScrollTrigger.create({
        trigger: sectionRef.current,
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
        trigger: sectionRef.current,
        start: "center 60%",
        onEnter: () => {
          if (!userClosedRef.current) setIsFullscreen(true)
        },
        onLeaveBack: () => {
          userClosedRef.current = false
          setIsFullscreen(false)
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    },
    { scope: sectionRef }
  )

  // Block interaction with the rest of the page while the modal is open.
  // Lenis drives scroll itself (independent of native scroll/overflow), so
  // it has to be stopped explicitly or the page keeps smooth-scrolling
  // underneath the "blocking" modal.
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : ""

    const lenis = getLenis()
    if (isFullscreen) {
      lenis?.stop()
    } else {
      lenis?.start()
    }

    return () => {
      document.body.style.overflow = ""
      lenis?.start()
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
    <div className="px-5">
      <div
        ref={sectionRef}
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
          ref={boxRef}
          className={cn(
            "group overflow-hidden border border-border bg-card shadow-2xl transition-[position,inset,width,height,margin,border-radius] duration-500 ease-in-out",
            isFullscreen
              ? "fixed inset-0 z-100 m-auto rounded-3xl md:h-[80vh] md:w-[99vw] md:max-w-7xl"
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
            <span className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow-2xl backdrop-blur transition-transform duration-300 hover:scale-110">
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
              className="absolute top-4 right-4 z-10 flex size-12 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white backdrop-blur hover:border hover:bg-white/20 hover:text-background"
              data-cursor="magnetic"
            >
              <X className="size-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
