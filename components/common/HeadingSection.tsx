import { SectionBadge } from "@/components/common/SectionBadge"
import { cn } from "@/lib/utils/cn"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Fragment, type Ref } from "react"

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
  /** Optional CTA, rendered pinned to the row's end column, bottom-aligned,
   * e.g. `{ label: "Discover More", href: "/#what-we-do" }`. */
  link?: HeadingSectionLink
  /** Optional supporting text, rendered in the row's end column, top-aligned
   * with the badge/title. Only meaningful when `link` isn't also passed —
   * no current usage combines both. */
  description?: string
  className?: string
}

/** Shared badge + title (+ optional description or link) row used at the
 * top of every homepage section and reused across layouts, so the same
 * layout doesn't get re-authored per section.
 *
 * Badge, title, and the end-slot (description or link — whichever the
 * caller passes) all sit in **one row** at `lg:` and up
 * (`grid-cols-[auto_1fr_auto]`), badge and title start-aligned together at
 * the row's top, the end-slot pinned to the far end (`link` additionally
 * bottom-aligned via its own `self-end`, matching the reference design
 * where the button sits low against a multi-line title).
 *
 * The fix that makes this safe at laptop widths, versus the original
 * version of this same layout: **title's own grid track is the flexible
 * `1fr`, not `auto`.** The original had it the other way around — title as
 * an unconstrained `auto` track free to claim space up to its `max-w`,
 * while the end-slot was squeezed into whatever was left over. On a
 * ~1024–1440px laptop screen (a MacBook Air 13" being the reference case
 * that surfaced this), that left too little room for the end-slot, breaking
 * the button in WhoWeAreSection and squeezing the paragraph in
 * FoundersSection. Giving `1fr` to the title instead means it's the one
 * that shrinks/wraps under width pressure, while the badge and end-slot
 * keep their natural size and are never squeezed.
 *
 * Below `lg:`, this collapses to a single stacked column, in DOM order:
 * badge, title, then description or link. */
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
        "grid gap-5 border-t border-line pt-12 sm:gap-6 sm:pt-8 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-10",
        className
      )}
    >
      <SectionBadge className="lg:col-start-1">{badge}</SectionBadge>

      <h2
        ref={titleRef}
        className="max-w-3xl min-w-0 heading-section text-ink capitalize lg:col-start-2 lg:max-w-4xl"
      >
        {/* A "\n" in the title marks a deliberate line break (sm and up;
            phones wrap naturally). */}
        {title.split("\n").map((line, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <>
                {" "}
                <br className="hidden sm:block" />
              </>
            )}
            {line}
          </Fragment>
        ))}
      </h2>

      {description && (
        <p className="max-w-md text-[15px] leading-relaxed text-ink-2 sm:text-lg lg:col-start-3 lg:shrink-0">
          {description}
        </p>
      )}

      {link && (
        <Link
          href={link.href}
          data-cursor="magnetic"
          className="group/link inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-300 hover:border-signal hover:bg-signal hover:text-signal-ink lg:col-start-3 lg:self-end lg:justify-self-end"
        >
          {link.label}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-500 ease-premium group-hover/link:translate-x-1"
          />
        </Link>
      )}
    </div>
  )
}
