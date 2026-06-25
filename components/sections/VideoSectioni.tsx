"use client"

import { useEffect, useRef, useState } from "react"
import { Play, X } from "lucide-react"

interface VideoSectionProps {
  src: string
  poster?: string
}

export default function VideoSection({ src, poster }: VideoSectionProps) {
  const previewRef = useRef<HTMLVideoElement>(null)
  const fullscreenRef = useRef<HTMLVideoElement>(null)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!previewRef.current) return

    previewRef.current.play().catch(() => {})
  }, [])

  useEffect(() => {
    if (!fullscreenRef.current) return

    if (open) {
      fullscreenRef.current.currentTime = previewRef.current?.currentTime || 0

      fullscreenRef.current.play().catch(() => {})
    } else {
      fullscreenRef.current.pause()
    }
  }, [open])

  return (
    <>
      <section className="container pb-24">
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <video
            ref={previewRef}
            className="aspect-video w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
          >
            <source src={src} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/30" />

          <button
            onClick={() => setOpen(true)}
            className="absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-2xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
          >
            <Play className="ml-1 h-8 w-8 fill-current" />
          </button>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-100 bg-black">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur"
          >
            <X className="h-6 w-6" />
          </button>

          <video
            ref={fullscreenRef}
            className="h-screen w-screen object-contain"
            controls
            autoPlay
            playsInline
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      )}
    </>
  )
}
