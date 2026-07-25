"use client"

import type { HeroReviewsData } from "@/lib/data/hero-panel"
import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Star } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

interface HeroReviewsProps {
  data: HeroReviewsData
  className?: string
}

/** Overlapping client avatars + star rating + a one-line trust statement.
 * The stars shimmer on a slow, occasional loop rather than a constant
 * pulse — reads as a subtle "still live" signal, not a distraction. */
export function HeroReviews({ data, className }: HeroReviewsProps) {
  const starsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const stars = starsRef.current?.querySelectorAll("[data-star]")
      if (!stars || stars.length === 0) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(stars, {
          opacity: 0.35,
          duration: 0.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          repeatDelay: 3.5,
          stagger: { each: 0.12, from: "start" },
        })

        return () => tween.kill()
      })

      return () => mm.revert()
    },
    { scope: starsRef }
  )

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex items-center -space-x-3">
          <Image
            src="/images/customers.png"
            alt="Customers reviews"
            width={160}
            height={100}
            className="h-auto w-28 sm:w-40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div ref={starsRef} className="flex items-center gap-0.5">
            {Array.from({ length: data.rating }).map((_, index) => (
              <Star
                key={index}
                data-star
                className="size-3.5 fill-accent text-accent"
              />
            ))}
          </div>
          <p className="text-sm font-medium text-white/50 sm:text-base">
            {data.rating.toFixed(1)} {data.ratingLabel}
          </p>
        </div>

        <p className="text-sm text-white/40 sm:text-base">{data.trustedBy}</p>
      </div>
    </div>
  )
}
