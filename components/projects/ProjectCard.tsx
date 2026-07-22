"use client"

import { ProjectInfo } from "@/components/projects/ProjectInfo"
import {
  ProjectMedia,
  type ProjectMediaHandle,
} from "@/components/projects/ProjectMedia"
import type { ProjectStackItem } from "@/lib/projects"
import { cn } from "@/lib/utils/cn"
import gsap from "gsap"
import Image from "next/image"
import Link from "next/link"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

export interface ProjectCardHandle {
  root: HTMLDivElement | null
  play: () => void
  pause: () => void
}

interface ProjectCardProps {
  item: ProjectStackItem
  priority?: boolean
}

/**
 * A single stacked-gallery card. Owns everything purely local to pointer
 * interaction (parallax, cursor glow, hover lift) — the scroll-driven
 * active/inactive state comes from outside via the `data-active` attribute,
 * and video play/pause via the imperative handle, both set exclusively by
 * `useProjectsStackAnimation`. Never touches React state itself, so hover
 * and scroll can both run every frame without triggering a re-render.
 *
 * The root is a plain div, not a link — the card exposes two independent
 * destinations instead of one whole-card link: the "Explore" button over
 * the image goes straight to the live project URL, and "View Case Study"
 * in the info bar goes to the internal case-study page. Nesting either
 * inside a card-wide `<a>` would be invalid HTML, hence the split.
 *
 * The pointer-parallax translate is applied to the inner media wrapper
 * (not this root element) specifically so it never collides with the
 * `data-active`-driven scale/opacity, which are plain Tailwind classes on
 * the root — GSAP writing a raw inline `transform` on the same node the
 * Tailwind utilities compose their own `transform` on would clobber it.
 */
export const ProjectCard = forwardRef<ProjectCardHandle, ProjectCardProps>(
  function ProjectCard({ item, priority }, ref) {
    const rootRef = useRef<HTMLDivElement>(null)
    const mediaWrapRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    const mediaHandleRef = useRef<ProjectMediaHandle>(null)

    useImperativeHandle(ref, () => ({
      get root() {
        return rootRef.current
      },
      play: () => mediaHandleRef.current?.play(),
      pause: () => mediaHandleRef.current?.pause(),
    }))

    useEffect(() => {
      const root = rootRef.current
      const mediaWrap = mediaWrapRef.current
      const glow = glowRef.current
      if (!root || !mediaWrap || !glow) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

      const setMediaX = gsap.quickTo(mediaWrap, "x", {
        duration: 0.5,
        ease: "power3.out",
      })
      const setMediaY = gsap.quickTo(mediaWrap, "y", {
        duration: 0.5,
        ease: "power3.out",
      })

      const handleMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect()
        const relX = (event.clientX - rect.left) / rect.width
        const relY = (event.clientY - rect.top) / rect.height

        setMediaX((relX - 0.5) * 16)
        setMediaY((relY - 0.5) * 16)
        glow.style.setProperty("--x", `${relX * 100}%`)
        glow.style.setProperty("--y", `${relY * 100}%`)
      }

      const handleLeave = () => {
        setMediaX(0)
        setMediaY(0)
      }

      root.addEventListener("pointermove", handleMove)
      root.addEventListener("pointerleave", handleLeave)

      return () => {
        root.removeEventListener("pointermove", handleMove)
        root.removeEventListener("pointerleave", handleLeave)
      }
    }, [])

    const exploreHref = item.liveUrl ?? `/projects/${item.slug}`

    return (
      <div
        ref={rootRef}
        className={cn(
          "group glass relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-3xl shadow-2xl",
          "transition-[transform,opacity,box-shadow] duration-500 ease-out",
          "hover:-translate-y-1.5 hover:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)]",
          "data-[active=true]:scale-[1.015] data-[active=true]:opacity-100",
          "data-[active=false]:scale-[0.99] data-[active=false]:opacity-80"
        )}
      >
        <span
          aria-hidden="true"
          className="ring-brand-primary/40 pointer-events-none absolute inset-0 z-20 rounded-3xl opacity-0 ring-1 ring-inset transition-opacity duration-500 group-hover:opacity-100"
        />

        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklch, var(--brand-primary) 20%, transparent), transparent 70%)",
          }}
        />

        <div className="relative flex-1 overflow-hidden">
          <div ref={mediaWrapRef} className="absolute -inset-2">
            <ProjectMedia
              ref={mediaHandleRef}
              image={item.thumbnail}
              alt={item.title}
              priority={priority}
            />
          </div>

          <Link
            href={exploreHref}
            target={item.liveUrl ? "_blank" : undefined}
            rel={item.liveUrl ? "noopener noreferrer" : undefined}
            data-cursor="magnetic"
            aria-label={`Explore ${item.title}`}
            className="absolute inset-0 z-30 m-auto flex h-12 w-fit scale-90 items-center gap-3 rounded-full border border-white/20 bg-white/90 py-1.5 pr-1.5 pl-6 text-sm font-semibold text-black opacity-0 backdrop-blur-md transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
          >
            Explore
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black">
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                width={14}
                height={14}
                className="invert"
              />
            </span>
          </Link>
        </div>

        <ProjectInfo
          title={item.title}
          year={item.year}
          category={item.category}
          techPills={item.techPills}
          slug={item.slug}
        />
      </div>
    )
  }
)
