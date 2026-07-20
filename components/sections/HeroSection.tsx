"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import "@/lib/animations/gsap-animations"
import type { HeroBannerData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(SplitText)

interface HeroSectionProps {
  data: HeroBannerData
}

export default function HeroSection({ data }: HeroSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useGSAP(
    () => {
      const headingElement = contentRef.current?.querySelector("h1")
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

      // `stickyRef`'s parent is the `relative` wrapper in app/page.tsx that
      // holds both Hero and About — it's what the sticky background pins
      // against for their combined height. Scrubbing the video's own
      // transform across that same range (instead of moving the sticky
      // layer itself) is what reads as parallax while the pin stays pure
      // CSS, with no JS-driven pin/unpin to jitter.
      const sharedBackground = stickyRef.current?.parentElement
      if (!sharedBackground || !videoRef.current) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          videoRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: sharedBackground,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          }
        )

        return () => {
          tween.scrollTrigger?.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: contentRef }
  )

  return (
    <>
      <div
        ref={stickyRef}
        className="sticky top-0 z-0 h-screen w-full overflow-hidden bg-brand-dark"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.15] object-cover will-change-transform"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mt-[-100vh] flex min-h-screen w-full flex-col"
      >
        <div className="mx-auto flex w-full max-w-400 flex-1 flex-col items-center justify-center px-5 py-32 mt-20 text-center sm:px-8">
          <h1 className="max-w-6xl text-5xl font-medium tracking-tight text-white uppercase lg:text-[90px]">
            {data.title}
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/70 sm:text-2xl">
            {data.description}
          </p>

          <PrimaryButton href={data.button.href} className="mt-10">
            {data.button.label}
          </PrimaryButton>
        </div>
      </div>
    </>
  )
}
