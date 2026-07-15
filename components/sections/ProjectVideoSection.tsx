"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import { getLenis } from "@/lib/animations/lenis"
import type { ProjectVideoData } from "@/lib/data/home-page"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { ChevronRight, Pause, Play, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

interface OriginRect {
  top: number
  left: number
  width: number
}

interface ProjectVideoSectionProps {
  data: ProjectVideoData
}

export default function ProjectVideoSection({
  data,
}: ProjectVideoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const originRectRef = useRef<OriginRect | null>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  // The close button is a fixed-position sibling (not a child of box) so its
  // own size stays constant regardless of box's grow tween. Its top/left is
  // synced imperatively from box's real bounding rect. On desktop there's
  // room to float it clearly outside the corner; on mobile the modal spans
  // nearly the full width, so it sits on top of the corner instead — floating
  // it outside there would risk pushing it off-screen.
  const syncCloseButtonPosition = () => {
    const box = boxRef.current
    const button = closeButtonRef.current
    if (!box || !button) return

    const rect = box.getBoundingClientRect()
    const isMobile = window.innerWidth < 640

    if (isMobile) {
      button.style.top = `${rect.top + 16}px`
      button.style.left = `${rect.right - 16}px`
    } else {
      button.style.top = `${rect.top - 28}px`
      button.style.left = `${rect.right + 28}px`
    }
  }

  // Grows from half width up to its natural full size as the section
  // scrolls into view. This tweens `width` (never `scale`) specifically so
  // it can never compound with openFullscreen/closeFullscreen below, which
  // also drive `width` directly — one property, one source of truth.
  useGSAP(
    () => {
      if (!sectionRef.current || !boxRef.current) return

      gsap.effects.textRevealOnScroll(headingRef.current)

      gsap.fromTo(
        boxRef.current,
        { width: "50%" },
        {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: true,
          },
        }
      )

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

  // Unmute once the video opens as a modal; mute again in the small preview.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isFullscreen
  }, [isFullscreen])

  // Anchor the close button to box's real corner the instant it mounts
  // (useLayoutEffect so there's no one-frame flash at a stale position),
  // and keep it in sync if the viewport is resized while open.
  useLayoutEffect(() => {
    if (!isFullscreen) return
    syncCloseButtonPosition()
    window.addEventListener("resize", syncCloseButtonPosition)
    return () => window.removeEventListener("resize", syncCloseButtonPosition)
  }, [isFullscreen])

  const openFullscreen = () => {
    const box = boxRef.current
    if (!box) return

    // Freeze the box at its exact current on-screen position/size first, so
    // switching it to `position: fixed` causes no visible jump, then tween
    // from there to a centered, larger modal size — a lightweight FLIP.
    const rect = box.getBoundingClientRect()
    originRectRef.current = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
    }

    gsap.set(box, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      xPercent: 0,
      yPercent: 0,
    })

    const targetWidth = Math.min(window.innerWidth * 0.92, 1100)

    setIsFullscreen(true)

    gsap.to(box, {
      top: "50%",
      left: "50%",
      width: targetWidth,
      xPercent: -50,
      yPercent: -50,
      duration: 0.7,
      ease: "power3.inOut",
      onUpdate: syncCloseButtonPosition,
    })
  }

  const closeFullscreen = () => {
    const box = boxRef.current
    const origin = originRectRef.current
    if (!box || !origin) {
      setIsFullscreen(false)
      return
    }

    gsap.to(box, {
      top: origin.top,
      left: origin.left,
      width: origin.width,
      xPercent: 0,
      yPercent: 0,
      duration: 0.6,
      ease: "power3.inOut",
      onUpdate: syncCloseButtonPosition,
      onComplete: () => {
        gsap.set(box, {
          clearProps: "position,top,left,width,xPercent,yPercent",
        })
        setIsFullscreen(false)
      },
    })
  }

  // Before the modal is open, the button's job is to open it. Once open, the
  // same button (still the only control on the video) toggles play/pause.
  const handleButtonClick = () => {
    if (!isFullscreen) {
      openFullscreen()
      return
    }

    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  return (
    <section
      id="project-video"
      ref={sectionRef}
      className="overflow-hidden py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-4">
            <SectionBadge>{data.badge}</SectionBadge>

            <h2
              ref={headingRef}
              className="mt-6 text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              {data.title}
            </h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg">
              {data.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-8">
              <PrimaryButton href={data.primaryButton.href}>
                {data.primaryButton.label}
              </PrimaryButton>

              <Link
                href={data.secondaryButton.href}
                data-cursor="magnetic"
                className="group inline-flex items-center gap-1 text-lg font-semibold text-white transition-colors duration-300 hover:text-white/60"
              >
                {data.secondaryButton.label}
                <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative pb-6 sm:pb-10 lg:col-span-8 lg:pb-16">
            <div
              ref={boxRef}
              className={cn(
                "group relative mx-auto aspect-video max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl",
                // Above the backdrop while open, so the backdrop's blur only
                // affects the page behind it — not the enlarged video itself.
                isFullscreen ? "z-100" : "z-20"
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
                onClick={handleButtonClick}
                aria-label={
                  isFullscreen
                    ? isPlaying
                      ? "Pause video"
                      : "Play video"
                    : "Play video"
                }
                className="group/btn absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                data-cursor="magnetic"
              >
                <span className="relative flex size-20 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl backdrop-blur-md transition-transform duration-300 group-hover/btn:scale-110">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-linear-to-br from-white via-white/40 to-transparent opacity-70 transition-opacity duration-300 group-hover/btn:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 scale-100 rounded-full border border-black/10 opacity-0 transition-all duration-500 group-hover/btn:scale-125 group-hover/btn:opacity-100"
                  />
                  {isFullscreen && isPlaying ? (
                    <Pause className="relative size-7 fill-current" />
                  ) : (
                    <Play className="relative ml-1 size-7 fill-current" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <>
          <div
            className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeFullscreen}
            aria-label="Close video"
            className="group fixed z-110 flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-transform duration-300 hover:scale-110"
            data-cursor="magnetic"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-linear-to-br from-white/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 scale-100 rounded-full border border-white/40 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-0"
            />
            <X className="relative size-5 transition-transform duration-500 group-hover:rotate-180" />
          </button>
        </>
      )}
    </section>
  )
}
