"use client"

import { cn } from "@/lib/utils/cn"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { type ComponentPropsWithoutRef } from "react"

interface PrimaryButtonProps extends ComponentPropsWithoutRef<"button"> {
  href?: string
  showArrow?: boolean
  /** "solid" (default) is the high-contrast ink pill used everywhere else on
   *  the site. "outline" is a plain transparent/bordered pill for contexts
   *  that need something quieter. */
  variant?: "solid" | "outline"
}

// On hover the pill floods with the signal color (electric blue) from the arrow
// side, Cuberto-style; text on that fill is `primary-foreground` (white),
// readable in both themes. The arrow chip flips to the inverse neutral so it
// stays visible on top of the blue fill.
const variants = {
  solid: {
    pill: "border-[6px] border-neutral-100 bg-neutral-100 text-neutral-900",
    fill: "bg-primary",
    arrow:
      "bg-primary text-primary-foreground group-hover:bg-neutral-900 group-hover:text-primary",
    hoverText: "text-primary-foreground",
  },
  outline: {
    pill: "h-13 border border-white/20 bg-transparent text-white",
    fill: "bg-primary",
    arrow:
      "bg-primary text-primary-foreground group-hover:bg-neutral-900 group-hover:text-primary",
    hoverText: "text-primary-foreground",
  },
} as const

export function PrimaryButton({
  href,
  showArrow = true,
  variant = "solid",
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  const styles = variants[variant]

  const content = (
    <span className={cn("group relative inline-flex w-fit items-center", className)}>
      <span
        className={cn(
          "relative inline-flex h-15 items-center gap-3 overflow-hidden rounded-full text-base font-medium uppercase",
          styles.pill,
          showArrow ? "pr-6" : "px-6"
        )}
      >
        {/* The fill: a pill-shaped layer scaled from 0 (anchored at the
            left edge, where the arrow circle sits) up to full coverage on
            hover — reads as the button filling with color rather than a flat
            background crossfade. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 origin-left scale-x-0 rounded-full transition-transform duration-500 ease-premium group-hover:scale-x-100",
            styles.fill
          )}
        />

        {showArrow && (
          <span
            className={cn(
              "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ease-premium",
              styles.arrow
            )}
          >
            <ArrowRight className="size-4.5" aria-hidden="true" />
          </span>
        )}

        {/* Same vertical slide-reveal used for the Navbar's nav items — the
            visible layer slides down and out on hover while an inverse-color
            copy slides down into its place. */}
        <span className="relative z-10 inline-flex overflow-hidden whitespace-nowrap">
          <span className="block transition-transform duration-300 ease-premium group-hover:translate-y-full">
            {children}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 block -translate-y-full transition-transform duration-300 ease-premium group-hover:translate-y-0",
              styles.hoverText
            )}
          >
            {children}
          </span>
        </span>
      </span>
    </span>
  )

  if (href) {
    const isExternal = /^https?:\/\//.test(href)

    return (
      <Link
        href={href}
        className="inline-block w-fit"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="inline-flex w-fit cursor-pointer"
      {...props}
    >
      {content}
    </button>
  )
}
