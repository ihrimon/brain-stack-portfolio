import { cn } from "@/lib/utils/cn"
import type { ReactNode } from "react"

interface SectionBadgeProps {
  children: ReactNode
  variant?: "pill" | "label"
  /** Kept for API compatibility; the label variant no longer draws a marker. */
  dot?: boolean
  className?: string
}

/** The site's mono "system" label (x.ai-style). `pill` sits in a hairline
 * capsule whose border carries a small signal-colored light that orbits
 * around it (`.badge-border` in globals.css); `label` is the bare text.
 * `self-start` keeps it badge-sized when it sits in a grid/flex row next to
 * a tall heading, instead of stretching to the row's height. */
export function SectionBadge({ children, variant = "pill", className }: SectionBadgeProps) {
  if (variant === "label") {
    return (
      <div
        className={cn(
          "flex items-center self-start font-mono text-[11px] tracking-wider text-ink-2 uppercase",
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <span
      className={cn(
        "badge-border inline-flex w-fit items-center self-start rounded-full bg-ink/[0.03] px-4 py-1.5 font-mono text-[11px] tracking-wider whitespace-nowrap text-ink uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}
