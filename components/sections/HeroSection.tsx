"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionDivider } from "@/components/common/SectionDivider"
import { HeroStatsSection } from "@/components/sections/hero-panel/HeroStatsSection"
import "@/lib/animations/gsap-animations"
import { heroBannerData } from "@/lib/data/hero"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"

// How long each rotating headline stays on screen before crossfading to the
// next one in heroBannerData.title.
const TITLE_ROTATION_INTERVAL_MS = 5000

/** Renders `title` with its `highlight` substring picked out in italic
 * accent color, matching the reference layout's single-word emphasis.
 * Matches case-insensitively so `highlight` doesn't need to exactly mirror
 * the casing used inside `title`. */
function renderTitle(title: string, highlight: string): ReactNode {
  const index = title.toLowerCase().indexOf(highlight.toLowerCase())
  if (index === -1) return title

  return (
    <>
      {title.slice(0, index)}
      <em className="text-primary">
        {title.slice(index, index + highlight.length)}
      </em>
      {title.slice(index + highlight.length)}
    </>
  )
}

// three.js + React Three Fiber are a heavy dependency for a purely
// decorative, aria-hidden background — loading it client-only keeps it out
// of this page's server-rendered bundle entirely. No loading fallback
// needed: the sticky wrapper below already paints the same dark gradient as
// a plain CSS background, so there's nothing for a fallback to prevent
// layout shift or a color flash for.
const HeroBackground = dynamic(
  () =>
    import("@/components/three/hero-background/HeroBackground").then(
      (mod) => mod.HeroBackground
    ),
  { ssr: false }
)

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const [titleIndex, setTitleIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches)
    query.addEventListener("change", handleChange)
    return () => query.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (reducedMotion || heroBannerData.title.length <= 1) return
    const id = window.setInterval(() => {
      setTitleIndex((current) => (current + 1) % heroBannerData.title.length)
    }, TITLE_ROTATION_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  const ctaRow = (
    <div className="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-4">
      <PrimaryButton href={heroBannerData.button.href}>
        {heroBannerData.button.label}
      </PrimaryButton>

      <Link
        href={heroBannerData.secondaryButton.href}
        data-cursor="magnetic"
        className="group hidden items-center gap-1 text-sm font-semibold tracking-wide text-white uppercase underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white/60 lg:inline-flex"
      >
        {heroBannerData.secondaryButton.label}
        <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  )

  useGSAP(
    () => {
      // `stickyRef`'s parent is the `relative` wrapper in app/page.tsx that
      // holds both Hero and About — it's what the sticky background pins
      // against for their combined height. Scrubbing the background
      // wrapper's own transform across that same range (instead of moving
      // the sticky layer itself) is what reads as parallax while the pin
      // stays pure CSS, with no JS-driven pin/unpin to jitter. This is a
      // plain CSS transform on a wrapper div — independent of, and layered
      // on top of, the WebGL scene's own subtle cursor-driven motion.
      const sharedBackground = stickyRef.current?.parentElement
      if (!sharedBackground || !backgroundRef.current) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          backgroundRef.current,
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

  // Crossfades the headline into view — runs on mount (titleIndex starts at
  // 0) and again every time it advances. Deliberately a plain opacity/blur
  // tween on the whole h1 rather than a per-word SplitText effect: SplitText
  // destroys and rebuilds the element's text nodes, which desyncs React's
  // fiber tree from the live DOM and silently breaks later text updates.
  useGSAP(
    () => {
      if (!titleRef.current) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 10, filter: "blur(6px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power2.out",
          }
        )

        return () => tween.kill()
      })

      return () => mm.revert()
    },
    { dependencies: [titleIndex], scope: titleRef }
  )

  return (
    <>
      <div
        ref={stickyRef}
        className="sticky top-0 z-0 h-screen w-full overflow-hidden"
        style={{
          // Retuned to sit on the blobs' own base color (`#0c0d13` in
          // hero-background/constants.ts) rather than a separately-chosen
          // navy — that's what lets the blobs blend into the backdrop at
          // their edges instead of reading as a visibly different tone.
          background:
            "linear-gradient(180deg, #060710 0%, #0c0d13 50%, #0a0b12 100%)",
        }}
      >
        <div
          ref={backgroundRef}
          className="absolute inset-0 h-full w-full scale-[1.15] will-change-transform"
        >
          <HeroBackground className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      <div
        ref={contentRef}
        className="pointer-events-none relative z-10 mt-[-100vh] flex min-h-screen w-full flex-col"
      >
        <div className="mx-auto mt-20 flex w-full max-w-400 flex-1 flex-col justify-center px-4 py-32 sm:px-8">
          <h1
            ref={titleRef}
            className="max-w-5xl text-5xl leading-[1.05] font-semibold capitalize tracking-tight text-white lg:text-[90px]"
          >
            {renderTitle(
              heroBannerData.title[titleIndex],
              heroBannerData.highlight[titleIndex]
            )}
          </h1>

          {/* <SectionDivider
            top={false}
            bottom={false}
            className="mt-12 h-10 sm:mt-16"
            lineClassName="bg-white/10"
            iconClassName="text-white/40"
          /> */}

          {/* Hero Stats + CTA section */}
          <div className="mt-12 grid gap-12 pt-8 md:mt-16 lg:grid-cols-[1fr_1px_1.3fr] lg:items-stretch">

            {/* CTA Section */}
            <div className="order-1 flex flex-col items-start gap-8 lg:order-0">
              <p className="text-lg leading-relaxed text-white/70 sm:text-[22px]">
                {heroBannerData.description}
              </p>
              {ctaRow}
            </div>
            
            <div aria-hidden="true" className="hidden bg-white/10 lg:block" />
            
            <HeroStatsSection className="pointer-events-auto order-2 lg:order-0" />
          </div>
        </div>
      </div>
    </>
  )
}
