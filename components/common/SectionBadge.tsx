import { cn } from "@/lib/utils/cn"
import type { ReactNode } from "react"

interface SectionBadgeProps {
  children: ReactNode
  variant?: "pill" | "label"
  dot?: boolean
  className?: string
}

export function SectionBadge({
  children,
  variant = "pill",
  dot = false,
  className,
}: SectionBadgeProps) {
  if (variant === "label") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-xs font-medium tracking-widest text-white/60 uppercase",
          className
        )}
      >
        {dot && <span className="size-1.5 rounded-full bg-white" />}
        {children}
      </div>
    )
  }

  return (
    <span
      className={cn(
        "w-fit rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm",
        className
      )}
    >
      {children}
    </span>
  )
}
