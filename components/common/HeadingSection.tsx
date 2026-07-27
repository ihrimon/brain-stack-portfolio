import { SectionBadge } from "@/components/common/SectionBadge"
import { cn } from "@/lib/utils/cn"
import Image from "next/image"
import Link from "next/link"
import type { Ref } from "react"

interface HeadingSectionLink {
  label: string
  href: string
}

interface HeadingSectionProps {
  badge: string
  title: string
  /** Forwarded to the underlying `<h2>` so a parent's own GSAP scroll-reveal
   * effect (e.g. `gsap.effects.textRevealOnScroll`) can still target it. */
  titleRef?: Ref<HTMLHeadingElement>
  /** Optional right-side CTA, e.g. `{ label: "Discover More", href: "/#what-we-do" }`.
   * Mutually exclusive with `description` — both occupy the same end slot,
   * `link` takes priority if both are passed. */
  link?: HeadingSectionLink
  /** Optional right-side supporting text, rendered in the same end slot as
   * `link` instead of a button. Uses the same gap as badge-to-title so the
   * spacing rhythm stays consistent across the whole row. */
  description?: string
  className?: string
}

/** Shared badge + title (+ optional right-side link or description) row used
 * at the top of every homepage section — extracted from EngineeringProcess.tsx
 * so the same layout doesn't get re-authored per section. */
export function HeadingSection({
  badge,
  title,
  titleRef,
  link,
  description,
  className,
}: HeadingSectionProps) {
  return (
    <div
      className={cn(
        "grid gap-8 lg:grid-cols-[auto_auto_1fr] lg:items-start lg:gap-30",
        className
      )}
    >
      <SectionBadge>{badge}</SectionBadge>

      <h2
        ref={titleRef}
        className="max-w-3xl text-3xl leading-tight font-medium tracking-tight capitalize text-white sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>

      {link ? (
        <Link
          href={link.href}
          data-cursor="magnetic"
          className="group/link inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-background hover:text-foreground lg:justify-self-end lg:self-end"
        >
          {link.label}
          <Image
            src="/icons/arrow-right.svg"
            alt=""
            width={16}
            height={16}
            className="invert transition-transform duration-300 group-hover/link:translate-x-1"
          />
        </Link>
      ) : (
        description && (
          <p className="max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
            {description}
          </p>
        )
      )}
    </div>
  )
}
