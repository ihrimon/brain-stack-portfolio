"use client"

import { cn } from "@/lib/utils/cn"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Image from "next/image"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface ParallaxImageProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  className?: string
  wrapperClassName?: string
  strength?: number
}

export function ParallaxImage({
  src,
  alt,
  sizes,
  priority,
  placeholder,
  blurDataURL,
  className,
  wrapperClassName,
  strength = 12,
}: ParallaxImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useGSAP(
    () => {
      if (!imageRef.current) return

      gsap.set(imageRef.current, {
        yPercent: -strength,
        scale: 1.15,
        transformOrigin: "center center",
      })

      gsap.to(imageRef.current, {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    },
    { scope: wrapperRef }
  )

  return (
    <div
      ref={wrapperRef}
      className={cn("relative size-full overflow-hidden", wrapperClassName)}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        // See ProjectsGridSection.tsx for why `fetchPriority` is set
        // alongside `priority` explicitly on this Next.js version.
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={cn("object-cover", className)}
      />
    </div>
  )
}
