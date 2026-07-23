"use client"

import { cn } from "@/lib/utils/cn"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import Image from "next/image"
import { forwardRef, useImperativeHandle, useRef } from "react"

export interface ProjectMediaHandle {
  play: () => void
  pause: () => void
}

interface ProjectMediaProps {
  image: string
  video?: string
  lottie?: string
  alt: string
  priority?: boolean
  className?: string
}

/**
 * Dumb media renderer: the image is always the base/fallback layer, an mp4
 * (when provided) plays muted/looped on top once `play()` is called
 * imperatively — by the active-card tracker in `useProjectsStackAnimation`,
 * never from state here. `lottie` is accepted and wired through end to end
 * but stubbed: no project in the current data set ships a Lottie file, and
 * no Lottie dependency is installed, so this only reserves the prop/branch
 * for whenever a real asset shows up.
 */
export const ProjectMedia = forwardRef<ProjectMediaHandle, ProjectMediaProps>(
  function ProjectMedia({ image, video, lottie, alt, priority, className }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => ({
      play: () => {
        videoRef.current?.play().catch(() => {})
      },
      pause: () => {
        videoRef.current?.pause()
      },
    }))

    return (
      <div className={cn("relative size-full overflow-hidden", className)}>
        <Image
          src={image}
          alt={alt}
          fill
          quality={100}
          priority={priority}
          sizes="(min-width: 1024px) 640px, (min-width: 640px) 90vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className={cn(
            "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]",
            video && "opacity-0"
          )}
        />

        {video && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
        )}

        {lottie && (
          <div aria-hidden="true" data-lottie-src={lottie} className="absolute inset-0" />
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
      </div>
    )
  }
)
