"use client"

import { cn } from "@/lib/utils/cn"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/** How long each frame holds. */
const FRAME_MS = 2000
/** Crossfade between frames — long and eased, so frames melt into each
 * other instead of snapping. */
const FADE_MS = 1200

interface ProjectMediaProps {
  image: string
  /** Extra frames played as a crossfading "video" while hovered. */
  gallery?: readonly string[]
  /** A real looping clip, when a project has one — takes over from `gallery`. */
  video?: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}

/**
 * Card media with a Cuberto-style hover preview. The thumbnail is the base
 * layer; hovering the closest `[data-media-host]` ancestor plays either `video`
 * (muted loop, loaded only on first hover) or — since no project ships a
 * clip yet — crossfades through `gallery` like a short reel, with a story-
 * style progress bar. Gallery frames aren't requested until the first
 * hover, so an idle grid costs one image per card. Reduced-motion visitors
 * get the still thumbnail only.
 */
export function ProjectMedia({
  image,
  gallery = [],
  video,
  alt,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: ProjectMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [frame, setFrame] = useState(-1)

  const frames = gallery.filter((src) => src !== image)

  // Listen on the interactive wrapper (the link around this media), so the
  // preview starts wherever the card's hover target begins.
  useEffect(() => {
    const host = rootRef.current?.closest<HTMLElement>("[data-media-host]") ?? rootRef.current
    if (!host) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(hover: hover)").matches) return

    const enter = () => {
      setArmed(true)
      setPlaying(true)
    }
    const leave = () => setPlaying(false)
    host.addEventListener("pointerenter", enter)
    host.addEventListener("pointerleave", leave)
    return () => {
      host.removeEventListener("pointerenter", enter)
      host.removeEventListener("pointerleave", leave)
    }
  }, [])

  // Gallery reel
  useEffect(() => {
    if (video || frames.length === 0) return
    if (!playing) {
      const reset = window.setTimeout(() => setFrame(-1), 0)
      return () => window.clearTimeout(reset)
    }
    const first = window.setTimeout(() => setFrame(0), 300)
    const id = window.setInterval(
      () => setFrame((current) => (current + 1) % frames.length),
      FRAME_MS
    )
    return () => {
      window.clearTimeout(first)
      window.clearInterval(id)
    }
  }, [playing, video, frames.length])

  // Video clip
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (playing) void el.play().catch(() => {})
    else el.pause()
  }, [playing, armed])

  return (
    <div ref={rootRef} className={cn("relative size-full overflow-hidden", className)}>
      <div className="absolute inset-0 transition-transform duration-1000 ease-premium group-hover/media:scale-[1.04]">
        <Image
          src={image}
          alt={alt}
          fill
          quality={100}
          priority={priority}
          // See ProjectsGridSection.tsx for why `fetchPriority` is set
          // alongside `priority` explicitly on this Next.js version.
          fetchPriority={priority ? "high" : undefined}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />

        {armed &&
          !video &&
          frames.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes={sizes}
              className={cn(
                "object-cover",
                index === frame ? "scale-[1.06] opacity-100" : "scale-100 opacity-0"
              )}
              // Opacity crossfades; scale is a slow linear Ken Burns drift that
              // runs for the whole time a frame is on screen.
              style={{
                transition: `opacity ${FADE_MS}ms var(--ease-premium), scale ${FRAME_MS + FADE_MS}ms linear`,
              }}
            />
          ))}

        {armed && video && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-500",
              playing ? "opacity-100" : "opacity-0"
            )}
          >
            <source src={video} type="video/mp4" />
          </video>
        )}
      </div>

      {!video && frames.length > 0 && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-x-4 bottom-4 flex gap-1.5 transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0"
          )}
        >
          {frames.map((src, index) => (
            <span key={src} className="h-0.5 flex-1 overflow-hidden rounded-full bg-static-white/30">
              <span
                className={cn(
                  "block h-full origin-left bg-static-white",
                  index < frame && "scale-x-100",
                  index === frame && "animate-[frame-progress_var(--frame)_linear_forwards]",
                  index > frame && "scale-x-0"
                )}
                style={{ "--frame": `${FRAME_MS}ms` } as React.CSSProperties}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
