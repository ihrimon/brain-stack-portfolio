import { cn } from "@/lib/utils/cn"
import { Sparkle } from "lucide-react"

interface SectionDividerProps {
  /** Vertical stub extending up from the star. */
  top?: boolean
  /** Vertical stub extending down from the star. */
  bottom?: boolean
  /** Horizontal line extending left from the star. */
  left?: boolean
  /** Horizontal line extending right from the star. */
  right?: boolean
  /** Classes for the root wrapper (layout: width, margin, etc). */
  className?: string
  /** Classes for the four line segments. Defaults to the theme's border
   * token — override per call site for surfaces that are always dark
   * regardless of the site theme (e.g. the Hero band). */
  lineClassName?: string
  /** Classes for the center star icon. Defaults to the theme's muted-
   * foreground token, same override rationale as `lineClassName`. */
  iconClassName?: string
}

const STUB_LENGTH = "h-10"

/**
 * A center star with thin lines extending in up to four directions, used to
 * mark a transition between two blocks of content. Every arm is an
 * independently-toggleable boolean prop — the star and every rendered arm
 * meet at one exact point (absolutely centered for the vertical arms,
 * `flex` for the horizontal ones) so there's never a gap between them.
 */
export function SectionDivider({
  top = true,
  bottom = true,
  left = true,
  right = true,
  className,
  lineClassName = "bg-border",
  iconClassName = "text-muted-foreground",
}: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative flex items-center justify-center", className)}
    >
      {top && (
        <span
          className={cn(
            "absolute bottom-1/2 left-1/2 w-px -translate-x-1/2",
            STUB_LENGTH,
            lineClassName
          )}
        />
      )}
      {bottom && (
        <span
          className={cn(
            "absolute top-1/2 left-1/2 w-px -translate-x-1/2",
            STUB_LENGTH,
            lineClassName
          )}
        />
      )}

      {left && <span className={cn("h-px flex-1", lineClassName)} />}

      <Sparkle className={cn("relative z-10 size-5 shrink-0", iconClassName)} />

      {right && <span className={cn("h-px flex-1", lineClassName)} />}
    </div>
  )
}
