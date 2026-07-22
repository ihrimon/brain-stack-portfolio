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

/**
 * A center star with thin lines extending in up to four directions, used to
 * mark a transition between two blocks of content. The vertical arms are
 * `flex-1` inside a column layout rather than a fixed-length stub — their
 * length isn't baked into the component, it stretches to fill however much
 * height the wrapper ends up with: pass an explicit height via
 * `className` (e.g. `h-16`), or drop this in as a grid/flex item next to
 * `items-stretch` siblings and it'll automatically match their height.
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
      className={cn("flex flex-col items-center", className)}
    >
      {top && <span className={cn("w-px flex-1", lineClassName)} />}

      <div className="flex w-full shrink-0 items-center">
        {left && <span className={cn("h-px flex-1", lineClassName)} />}

        <Sparkle className={cn("size-5 shrink-0", iconClassName)} />

        {right && <span className={cn("h-px flex-1", lineClassName)} />}
      </div>

      {bottom && <span className={cn("w-px flex-1", lineClassName)} />}
    </div>
  )
}
