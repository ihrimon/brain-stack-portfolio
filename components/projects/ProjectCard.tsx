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
 * The root is a plain div, not a link — it exposes two independent
 * destinations instead of one whole-card link: "Explore Project", centered
 * over the image and visible only while hovering that image specifically
 * (scoped to its own `group/media`, not the card-wide `group`), goes
 * straight to the live project URL; "View Case Study" in the info bar
 * (ProjectInfo.tsx) goes to the internal case-study page. Nesting either
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

      // Only this element gets a compositor layer hint, and only for the
      // lifetime of this listener (removed on cleanup) — promoting all
      // eight cards' worth of elements permanently is the "will-change
      // misuse" that costs more GPU memory than it saves.
      mediaWrap.style.willChange = "transform"

      const handleMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect()
        const relX = (event.clientX - rect.left) / rect.width
        const relY = (event.clientY - rect.top) / rect.height

        setMediaX((relX - 0.5) * 16)
        setMediaY((relY - 0.5) * 16)
        // Plain instant sets — the smooth follow comes from the native
        // CSS `transition` on these two `@property`-registered custom
        // properties (see globals.css), not from any per-frame JS easing.
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
        mediaWrap.style.willChange = "auto"
      }
    }, [])

    const exploreHref = item.liveUrl ?? `/projects/${item.slug}`

    return (
      <div
        ref={rootRef}
        className={cn(
          "group border-6 relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-3xl",
          "bg-card/55 border-white/10 shadow-2xl backdrop-blur-lg",
          "transition-[transform,opacity,box-shadow,border-color] duration-500 ease-out",
          "hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)]",
          "data-[active=true]:scale-[1.015] data-[active=true]:opacity-100",
          "data-[active=false]:scale-[0.99] data-[active=false]:opacity-80"
        )}
      >
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100"
          style={{
            // Small and soft on purpose — a wide, saturated glow reads as
            // a spotlight and competes with the content; this is meant to
            // register as a barely-there warmth that follows the cursor.
            background:
              "radial-gradient(160px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklch, var(--brand-primary) 12%, transparent), transparent 65%)",
            transition:
              "opacity 0.5s ease, --x 0.6s cubic-bezier(0.16,1,0.3,1), --y 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* `group/media`: scopes "Explore Project" to hovering the image
            itself — the card-wide `group` above still drives the lift/
            border-glow/cursor-glow, but this button shouldn't appear just
            because the pointer is over the title or tech pills below. */}
        <div className="group/media relative flex-1 overflow-hidden">
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
            aria-label={`Explore ${item.title} — view project`}
            className="absolute inset-0 z-30 m-auto flex h-12 w-fit scale-90 items-center gap-3 rounded-full border border-white/20 bg-white/90 py-1.5 pr-1.5 pl-6 text-sm font-semibold text-black opacity-0 backdrop-blur-md transition-all duration-500 ease-out group-hover/media:scale-100 group-hover/media:opacity-100"
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
