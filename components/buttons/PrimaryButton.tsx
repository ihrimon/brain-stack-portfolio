"use client"

import { cn } from "@/lib/utils/cn"
import Image from "next/image"
import Link from "next/link"
import { type ComponentPropsWithoutRef } from "react"

interface PrimaryButtonProps extends ComponentPropsWithoutRef<"button"> {
  href?: string
  showArrow?: boolean
  /** "solid" (default) is the white-pill look used everywhere else on the
   *  site. "outline" is a plain transparent/bordered pill for contexts that
   *  need something quieter — e.g. ServiceContent.tsx. */
  variant?: "solid" | "outline"
}

export function PrimaryButton({
  href,
  showArrow = true,
  variant = "solid",
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  const content = (
    <span className={cn("group relative inline-flex w-fit items-center", className)}>
      <span
        className={cn(
          "relative inline-flex h-15 items-center gap-3 overflow-hidden rounded-full text-base font-medium uppercase",
          variant === "solid"
            ? "border-[6px] border-neutral-100 bg-neutral-100 text-neutral-900"
            : "border border-white/20 bg-transparent text-white h-13",
          showArrow ? "pr-6" : "px-6"
        )}
      >
        {/* The fill: a pill-shaped layer scaled from 0 (anchored at the
            left edge, where the arrow circle sits) up to full coverage on
            hover — reads as the button filling with color rather than a
            flat background crossfade. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100"
        />

        {showArrow && (
          <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary transition-colors duration-500 ease-out group-hover:bg-white group-hover:shadow-md">
            <Image src="/icons/arrow-right.svg" alt="" width={18} height={18} />
          </span>
        )}

        {/* Same vertical slide-reveal used for the Navbar's nav items — the
            visible layer slides down and out on hover while a second
            (white, since this pill flips to a solid fill) copy slides down
            into its place, rather than a flat color crossfade. */}
        <span className="relative z-10 inline-flex overflow-hidden whitespace-nowrap">
          <span className="block transition-transform duration-300 ease-out group-hover:translate-y-full">
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 block -translate-y-full text-white transition-transform duration-300 ease-out group-hover:translate-y-0"
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
        data-cursor="magnetic"
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
      data-cursor="magnetic"
      {...props}
    >
      {content}
    </button>
  )
}
