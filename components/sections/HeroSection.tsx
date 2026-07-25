"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { SectionDivider } from "@/components/common/SectionDivider"
import { HeroIntelligencePanel } from "@/components/sections/hero-panel/HeroIntelligencePanel"
import "@/lib/animations/gsap-animations"
import type { HeroBannerData } from "@/lib/data/home-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/all"
import { ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRef, type ReactNode } from "react"

gsap.registerPlugin(SplitText)

/** Renders `title` with its `highlight` substring picked out in italic
 * accent color, matching the reference layout's single-word emphasis. */
function renderTitle(title: string, highlight: string): ReactNode {
  const index = title.indexOf(highlight)
  if (index === -1) return title

  return (
    <>
      {title.slice(0, index)}
      <em className="text-primary">{highlight}</em>
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

interface HeroSectionProps {
  data: HeroBannerData
}

export default function HeroSection({ data }: HeroSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  const ctaRow = (
    <div className="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-4">
      <PrimaryButton href={data.button.href}>{data.button.label}</PrimaryButton>

      <Link
        href={data.secondaryButton.href}
        data-cursor="magnetic"
        className="group hidden items-center gap-1 text-sm font-semibold tracking-wide text-white uppercase underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white/60 lg:inline-flex"
      >
        {data.secondaryButton.label}
        <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  )

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
        className="relative z-10 mt-[-100vh] flex min-h-screen w-full flex-col pointer-events-none"
      >
        <div className="mx-auto flex w-full max-w-400 flex-1 flex-col justify-center px-4 py-32 mt-20 sm:px-8">
          <h1 className="max-w-5xl text-5xl leading-[1.05] font-bold tracking-tight text-white lg:text-[80px]">
            {renderTitle(data.title, data.highlight)}
          </h1>

          <SectionDivider
            top={false}
            className="mt-12 h-10 sm:mt-16"
            lineClassName="bg-white/10"
            iconClassName="text-white/40"
          />

          <div className="grid gap-16 lg:grid-cols-[1fr_1px_1fr] lg:items-stretch pt-8">
            <HeroIntelligencePanel className="pointer-events-auto order-2 lg:order-none" />

            <div aria-hidden="true" className="hidden bg-white/10 lg:block" />

            <div className="order-1 flex max-w-xl flex-col items-start gap-8 lg:order-none">
              <p className="text-base leading-relaxed text-white/70 sm:text-xl">
                {data.description}
              </p>
              {ctaRow}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
